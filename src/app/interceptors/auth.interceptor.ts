import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpResponse, HttpErrorResponse
} from '@angular/common/http';
import {catchError, from, Observable, switchMap, throwError} from 'rxjs';
import {AuthService} from "../services/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let authToken = localStorage.getItem('accessToken');
    if (authToken) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${authToken}`,
        }
      });
    }
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Unauthorized error, attempt to refresh the token
          return from(this.authService.loginWithRefreshToken()).pipe(
            switchMap(() => {
              // Token has been refreshed, clone the request and set the new token
              const newAuthToken = localStorage.getItem('accessToken');
              if (newAuthToken) {
                const newRequest = request.clone({
                  setHeaders: {
                    Authorization: `Bearer ${newAuthToken}`,
                  }
                });
                return next.handle(newRequest);
              } else {
                // If refresh failed and there is no new token, throw the original error
                return throwError(() => error);
              }
            })
          );
        } else {
          // If the error is not 401, throw the original error
          return throwError(() => error);
        }
      })
    );
  }
}

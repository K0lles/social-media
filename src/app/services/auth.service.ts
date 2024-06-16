import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse} from "@angular/common/http";
import {catchError, lastValueFrom} from "rxjs";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: User | undefined = undefined;

  constructor(private http: HttpClient, private router: Router, private snackBar: MatSnackBar) { }

  get isAuthenticated(): boolean {
    return !!this.user;
  }

  async login(loginData: {username: string, password: string}): Promise<string | void> {
    let wasAuthenticated = await this.getAuthTokens(loginData);
    if (!wasAuthenticated) {
      return 'Check username and password you`ve entered';
    }
    await this.getUserFromToken();
  }

  get localStorageHasAccessToken(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  async getAuthTokens(loginData: {username: string, password: string}): Promise<boolean> {
    try {
      let response = await lastValueFrom(this.http.post<Login>('/api/v1/auth/login/', loginData));
      let accessToken = response.access;
      let refreshToken = response.refresh;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      return true;
    } catch (error) {
      return false;
    }
  }

  async getUserFromToken(): Promise<void> {
    let accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      if (!localStorage.getItem('refreshToken')) {
        await this.router.navigate(['/login']);
        return; // Ensure function exits if no refresh token
      }
      await this.loginWithRefreshToken();
      accessToken = localStorage.getItem('accessToken'); // Get the new access token after refresh
      if (!accessToken) {
        await this.router.navigate(['/login']);
        return; // Ensure function exits if refresh token fails to provide new access token
      }
    }

    try {
      let response = await lastValueFrom(
        this.http.get<UserResponse>('api/v1/auth/user-info/', {
          headers: new HttpHeaders({
            'Authorization': `Bearer ${accessToken}`
          })
        })
      );
      this.user = {
        id: response.id,
        lastName: response.last_name,
        firstName: response.first_name,
        email: response.email,
        username: response.username,
        image: response.image ? response.image.replace("http://localhost:4200", "http://localhost:8000") : "",
        subscribers_amount: response.subscribers_amount
      };

    } catch (error) {
      localStorage.removeItem('accessToken');
      await this.loginWithRefreshToken();
    }
  }

  async loginWithRefreshToken(): Promise<void> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      await this.router.navigate(['/login']);
      return; // Ensure function exits if no refresh token
    }

    try {
      const response = await lastValueFrom(
        this.http.post<{ access: string; refresh: string }>('/api/v1/auth/token/refresh/', { refresh: refreshToken })
      );
      localStorage.setItem('accessToken', response.access);
      if (response.refresh) {
        localStorage.setItem('refreshToken', response.refresh);
      } else {
        await this.router.navigate(['/login']);
        return;
      }
      // Ensure that getUserFromToken is only called if tokens are successfully refreshed
      await this.getUserFromToken();
      return;
    } catch (error) {
      localStorage.removeItem('refreshToken');
      if (error instanceof HttpErrorResponse) {
        await this.router.navigate(['/login']);
        return;
      }
    }
  }

  async logout() {
    try {
      let response = await lastValueFrom(
        this.http.post<any>(
          'api/v1/auth/logout/',
          {
            'refresh_token': localStorage.getItem('refreshToken')
          },
          {
            headers: new HttpHeaders({
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            })
          }
        )
      );
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      this.user = undefined;
      await this.router.navigate(['/login'])
    } catch (error) {
      this.snackBar.open(
        "Something went wrong", 'Close', {horizontalPosition: 'right', verticalPosition: 'top'}
      );
    }
  }

  async signUpUser(data: UserSignUp) {
    try {
      let response = await lastValueFrom(this.http.post<UserSignUp>(
        '/api/v1/auth/sign-up/', data)
      );
      this.snackBar.open('You have been successfully signed up. Now login with your credentials.', 'Close',
        {horizontalPosition: 'end', verticalPosition: 'top'});
      await this.router.navigate(['/login']);
      return;
    } catch(error: any) {
      if (error instanceof HttpErrorResponse) {
        if (error.status === 400) {
          this.snackBar.open('User with this email already exists.', 'Close', {
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
        }
      }
    }
  }

  async initialize() {
    if (!this.isAuthenticated) {
      if (!this.localStorageHasAccessToken) {
        await this.router.navigate(['/login']);
        return;
      }
      await this.getUserFromToken();
    }
  }

  async updateUser(formData: {last_name: string, first_name: string, email: string, image: string}) {
    this.http.put('api/v1/auth/user-update/', formData, {
        headers: new HttpHeaders({
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        })
      }
    ).subscribe(async (response: any) => {
      this.snackBar.open('Data was changed.', 'Close',
        {horizontalPosition: 'end', verticalPosition: 'top'});
      await this.getUserFromToken();
    },
      (error) => {
        this.snackBar.open('Something went wrong.', 'Close',
          {horizontalPosition: 'end', verticalPosition: 'top'});
      })
  }

  getUserInfoById(id: string | number) {
    return this.http.get<AnotherUserResponse>("api/v1/auth/another-user/",
      {params: {user_id: id}}
    )
  }

  subscribe(id: string | number | undefined) {
    return this.http.post(`api/v1/auth/${id}/subscribe/`, {})
  }

  unsubscribe(id: string | number | undefined) {
    return this.http.post(`api/v1/auth/${id}/unsubscribe/`, {})
  }

  getUsersForSearch() {
    return this.http.get<UserForSearch[]>('api/v1/auth/users-for-search/');
  }


}


export interface UserResponse {
  id: number
  first_name: string
  last_name: string
  email: string
  username: string
  image: string
  subscribers_amount: number | null
}

export interface User {
  id: number
  firstName: string
  lastName: string
  username: string
  email: string | null
  image: string | null
  subscribers_amount: number | null
}

export interface Login {
  access: string;
  refresh: string;
}

export interface UserSignUp{
  first_name: any
  last_name: any
  username: any
  password: any
}

export interface AnotherUserResponse {
  id: number
  first_name: string
  last_name: string
  email: string
  username: string
  image: string
  subscribers_amount: number | null
  is_subscribed: boolean
}

export interface UserForSearch {
  id: number
  username: string
  user_image: string | null
}

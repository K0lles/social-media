import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  // Observable<HttpResponse<any>>
  login(loginData: {username: string, password: string}): void {
    if (localStorage.getItem("accessToken")) {
      return;
    }
    this.http.post<Login>(ROOT_URL, loginData).subscribe(response => {
      let accessToken = response.access_token;
      let refreshToken = response.refresh_token;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    });
  }

  get isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  }

}

export const ROOT_URL = '127.0.0.1'

export interface Login {
  access_token: string;
  refresh_token: string;
}

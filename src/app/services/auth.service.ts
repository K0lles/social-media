import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {lastValueFrom} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: User | undefined;

  constructor(private http: HttpClient) { }

  async login(loginData: {username: string, password: string}) {
    let response = await lastValueFrom(this.http.post<Login>('/api/v1/auth/login/',loginData))
    let accessToken = response.access;
    let refreshToken = response.refresh;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    await this.getUserInfo();
  }

  async getUserInfo() {
    if (this.isAuthenticated) {
      let responseUser = await lastValueFrom(this.http.get<any>(
        'api/v1/auth/user-info/',
        {headers: {'Authorization': `Bearer ${localStorage.getItem('accessToken')}`}}
      ));
      this.user = {
        firstName: responseUser.first_name,
        lastName: responseUser.last_name,
        username: responseUser.username,
        email: responseUser.email
      };
      console.log(this.user);
    }
  }

  get isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  }

}


export interface User {
  firstName: string,
  lastName: string,
  username: string
  email: string
}

export interface Login {
  access: string;
  refresh: string;
}

import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Subject} from "rxjs";
import {webSocket} from "rxjs/webSocket";
import {AuthService} from "./auth.service";

const SOCKET_URL = 'ws://localhost:8000/ws/chat/';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  socket: Subject<any> | undefined;

  constructor(private http: HttpClient, private authService: AuthService) {
    if (this.authService.isAuthenticated) {
      this.socket = webSocket({
        url: SOCKET_URL,
        protocol: [
          localStorage.getItem('accessToken') ?? ''
        ]
      });

      this.socket.asObservable().subscribe((response) => {
        console.log(response)
      })
    }
  }
}

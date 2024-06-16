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
        ],
      });

      this.socket.asObservable().subscribe((response) => {
        console.log(response)
      });
    }
  }

  getChatList() {
    return this.http.get<ChatList[]>('api/v1/chat/');
  }

  getChatInfo(chatId: string | number) {
    return this.http.get<ChatInfo>(`api/v1/chat/${chatId}/`);
  }

  getMessageList(chatId: string) {
    return this.http.get<Message[]>(`api/v1/chat/messages/`, {params: {chat_id: chatId}});
  }

  connectWebSocket() {
    if (this.authService.isAuthenticated) {
      this.socket = webSocket({
        url: SOCKET_URL,
        protocol: [
          localStorage.getItem('accessToken') ?? ''
        ],
      });

      this.socket.asObservable().subscribe((response) => {
        console.log(response)
      });
    }
  }

  createSingleChat(data: {user_id: number}) {
    return this.http.post<CreateSingleChat>('api/v1/chat/create-single-chat/', data);
  }

  createGroupChat(data: any) {
    return this.http.post<CreateSingleChat>('api/v1/chat/create-group-chat/', data);
  }
}


export interface Message {
  id: number
  sender_username: string
  text: string
  created_at: string
}

export interface CreateSingleChat {
  id: number
  user: number
  created_at: string
}

export interface ChatInfo {
  id: number
  name: string | null
  users: {user_id: number, user_username: string, user_first_name: string, user_last_name: string, user_image: string | null}[]
  is_group: boolean
  created_at: string
}

export interface ChatList {
  id: number
  chat_name: string
  last_message_text: string | null
  is_group: boolean
  image: string | null
  last_message_date: string | null
  created_at: string
}

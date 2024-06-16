import {Component, Injectable, OnInit} from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from "@angular/router";
import {ChatList, ChatService} from "../services/chat.service";
import {catchError, forkJoin, Observable, of} from "rxjs";

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss']
})
export class ChatListComponent implements OnInit{
  chats: ChatList[];

  constructor(private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    this.chats = this.route.snapshot.data['chats'];
    console.log(this.chats);
  }

  toChat(id: string | number) {
    return this.router.navigate([`/chat/${id}`]);
  }
}

@Injectable({
  providedIn: 'root'
})
export class ChatListResolverService implements Resolve<any> {

  constructor(private chatService: ChatService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.chatService.getChatList().pipe(
      catchError((error) => {
        console.error('Error fetching post:', error);
        this.router.navigate(['']);
        return of(null);
      })
    );
  }
}

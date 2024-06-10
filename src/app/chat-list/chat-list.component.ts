import { Component } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss']
})
export class ChatListComponent {

  constructor(private router: Router) {
  }

  toChat(id: string | number) {
    this.router.navigate([`chat/${id}`])
  }
}

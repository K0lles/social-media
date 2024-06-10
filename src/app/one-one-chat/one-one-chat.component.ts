import {Component, Inject, Optional} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-one-one-chat',
  templateUrl: './one-one-chat.component.html',
  styleUrls: ['./one-one-chat.component.scss']
})
export class OneOneChatComponent {
  users: string[] = []; // List of users, replace with actual user data

  constructor() { }

  ngOnInit(): void {
    // Fetch users data from backend API and populate this.users array
    // Example:
    // this.userService.getUsers().subscribe((data: any) => {
    //   this.users = data;
    // });
  }

  addUserToChat(user: string) {
    // Logic to add user to chat
    console.log(`User ${user} added to chat`);
  }

  createChat() {
    // Logic to send request to backend to create chat
    console.log('Chat created');
  }
}

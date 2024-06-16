import {Component, Inject, OnInit, Optional} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {map, Observable, of, startWith} from "rxjs";
import {FormControl} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService, UserForSearch} from "../services/auth.service";
import {ChatService} from "../services/chat.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-one-one-chat',
  templateUrl: './one-one-chat.component.html',
  styleUrls: ['./one-one-chat.component.scss']
})
export class OneOneChatComponent implements OnInit {

  selectedIds: number[] = [];
  isGroupChat: boolean = false;
  users: UserForSearch[] = [];
  filteredUsers: UserForSearch[] = [];
  searchControl: FormControl<string> = new FormControl();
  chatNameControl: FormControl<string> = new FormControl();

  constructor(
    private authService: AuthService,
    private chatService: ChatService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.authService.getUsersForSearch().subscribe(
      (response) => {
        this.users = response.filter((user) => user.username != this.authService.user?.username);
        this.filteredUsers = this.users;
      }
    )
    this.searchControl.valueChanges.subscribe(value => this.filterUsers(value));
    // Fetch users data from backend API and populate this.users array
    // Example:
    // this.userService.getUsers().subscribe((data: any) => {
    //   this.users = data;
    // });
  }

  private filterUsers(value: string) {
    if (!value) {
      this.filteredUsers = this.users;
      return;
    }
    const filterValue = value.toLowerCase();
    this.filteredUsers = this.users.filter(user => user.username.toLowerCase().includes(filterValue));
  }

  addUserToChat(user: string) {
    // Logic to add user to chat
    console.log(`User ${user} added to chat`);
  }

  createChat() {
    if (this.isGroupChat) {
      let data = {
        name: this.chatNameControl.value,
        users: this.selectedIds,
        is_group: true
      };
      this.chatService.createGroupChat(data).subscribe(
        (response) => {
          this.snackBar.open(
            "Chat successfully created.", 'Close', {horizontalPosition: 'right', verticalPosition: 'top'}
          );
          return this.router.navigate([`/chat/${response.id}`])
        }
      );
    }
    else {
      let data = {
        user_id: this.selectedIds[0]
      };
      this.chatService.createSingleChat(data).subscribe(
        (response) => {
          this.snackBar.open(
            "Chat successfully created.", 'Close', {horizontalPosition: 'right', verticalPosition: 'top'}
          );
          return this.router.navigate([`/chat/${response.id}`])
        }
      );
    }
  }

  changeIsGroup(value: boolean) {
    this.isGroupChat = value;

    if (!value && this.selectedIds.length > 1) {
      this.selectedIds = [];
    }
  }

  setActiveUser(id: number) {
    if (!this.selectedIds.includes(id)) {
      this.selectedIds.push(id);

      if (!this.isGroupChat) this.selectedIds = [id];
    } else {
      this.selectedIds = this.selectedIds.filter(s => s!= id);
    }
  }
}

import {Component, OnInit} from '@angular/core';
import {AnotherUserResponse, AuthService, UserResponse} from "../services/auth.service";
import {Post, PostsService} from "../services/posts.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-user-subscribe',
  templateUrl: './user-subscribe.component.html',
  styleUrls: ['./user-subscribe.component.scss']
})
export class UserSubscribeComponent implements OnInit{
  user: AnotherUserResponse | undefined;
  posts: Post[] | undefined;

  constructor(
    private authService: AuthService,
    private postsService: PostsService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
  }

  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate([''])
      return;
    }
    this.authService.getUserInfoById(id).subscribe((response) => {
      response.image = response.image ? response.image.replace(':4200', ':8000') : '';
      this.user = response;
    });
    this.postsService.getPostsOfUser(id).subscribe(
      (response => {
        for (let post of response) {
          post.image = post.image ? post.image.replace(':4200', ':8000') : '';
        }
        this.posts = response
      })
    );
  }

  get myUser() {
    return this.authService.user;
  }

  subscribe () {
    this.authService.subscribe(this.user?.id).subscribe(
      (response) => {
        this.snackBar.open(
          "Successfully subscribed", "Close", {horizontalPosition: 'right', verticalPosition: 'top'}
        )
        if (this.user) {
          this.user.is_subscribed = true;
          this.authService.getUserInfoById(this.user.id).subscribe((response) => {
            response.image = response.image ? response.image.replace(':4200', ':8000') : '';
            this.user = response;
          });
        }
      }
    )
  }

  unsubscribe() {
    this.authService.unsubscribe(this.user?.id).subscribe(
      (response) => {
        this.snackBar.open(
          "Successfully unsubscribed", "Close", {horizontalPosition: 'right', verticalPosition: 'top'}
        )
        if (this.user) {
          this.user.is_subscribed = false;
          this.authService.getUserInfoById(this.user.id).subscribe((response) => {
            response.image = response.image ? response.image.replace(':4200', ':8000') : '';
            this.user = response;
          });
        }
      }
    )
  }

}

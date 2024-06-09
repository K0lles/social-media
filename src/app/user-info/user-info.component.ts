import {Component, OnInit} from '@angular/core';
import {AuthService} from "../services/auth.service";
import {PostsService} from "../services/posts.service";

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit{
  posts: {id: number, image: string, text: string, created_at: string, comments_amount: number}[] | undefined;

  constructor(private authService: AuthService, private postsService: PostsService) {
  }

  async ngOnInit() {
    this.posts = await this.postsService.getMyPosts();
  }

  get user() {
    return this.authService.user;
  }

}

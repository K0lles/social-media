import {Component, OnInit} from '@angular/core';
import {PostsService} from "../services/posts.service";
import {AuthService, User} from "../services/auth.service";

@Component({
  selector: 'app-my-posts',
  templateUrl: './my-posts.component.html',
  styleUrls: ['./my-posts.component.scss']
})
export class MyPostsComponent implements OnInit {
  myPosts: {id: number, image: string, text: string, created_at: string}[] = [];
  user: User | undefined;

  constructor(private postsService: PostsService, private authService: AuthService) {}

  async ngOnInit() {
    this.user = this.authService.user;
    this.myPosts = await this.postsService.getMyPosts();
  }

  editPost(postId: number): void {
    // Implement your logic to edit the post
    console.log(`Edit post with id: ${postId}`);
  }

  deletePost(postId: number): void {
    // Implement your logic to delete the post
    console.log(`Delete post with id: ${postId}`);
  }
}

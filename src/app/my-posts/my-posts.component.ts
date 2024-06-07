import {Component, OnInit} from '@angular/core';
import {PostsService} from "../services/posts.service";

@Component({
  selector: 'app-my-posts',
  templateUrl: './my-posts.component.html',
  styleUrls: ['./my-posts.component.scss']
})
export class MyPostsComponent implements OnInit {
  myPosts = [
    {
      id: 1,
      userLogo: 'path_to_user_logo.jpg',
      username: 'UserName',
      image: 'path_to_post_image.jpg',
      text: 'This is the first post',
      commentsAmount: 5
    }
    // {
    //   id: 2,
    //   userLogo: 'path_to_user_logo.jpg',
    //   username: 'UserName',
    //   image: 'path_to_post_image.jpg',
    //   text: 'This is the second post',
    //   commentsAmount: 3
    // }
  ];

  constructor(private postsService: PostsService) {}

  async ngOnInit() {
    let myPosts = await this.postsService.getMyPosts();
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

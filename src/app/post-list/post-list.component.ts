import { Component } from '@angular/core';

export interface Post {
  id: number
  userLogo: string
  image: string
  username: string
  text: string
  commentsAmount: number
}

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent {

  public posts: Post[] = [
    {
      id: 1,
      username: "limpangchump",
      userLogo: "assets/images/avatar-jessica.jpeg",
      image: "assets/images/nature.jpg",
      text: "Hello guys. Whazzup?",
      commentsAmount: 15
    }
  ]
}

import { Component } from '@angular/core';
import {Post} from "../services/posts.service";


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
      comments_amount: 15,
      created_at: "2022"
    }
  ]
}

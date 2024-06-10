import {Component, OnInit} from '@angular/core';
import {AnotherPeoplePost, Post, PostsService} from "../services/posts.service";


@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit{
  public posts: AnotherPeoplePost[] = [
    // {
    //   id: 1,
    //   owner_username: "limpangchump",
    //   owner_image: "assets/images/avatar-jessica.jpeg",
    //   image: "assets/images/nature.jpg",
    //   text: "Hello guys. Whazzup?",
    //   comments_amount: 15,
    //   created_at: "2022"
    // }
  ]

  constructor(private postsService: PostsService) {
  }

  ngOnInit() {
    this.postsService.getAnotherPeoplePosts().subscribe(
      (response) => {
        this.posts = response
      }
    )
  }

}

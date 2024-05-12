import {Component, OnInit} from '@angular/core';
import {Post} from "../post-list/post-list.component";
import {ActivatedRoute, Router} from "@angular/router";

interface Comment {
  username: string
  userImage: string
  text: string
}

@Component({
  selector: 'app-post-comments',
  templateUrl: './post-comments.component.html',
  styleUrls: ['./post-comments.component.scss']
})
export class PostCommentsComponent implements OnInit{

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      console.log(params)
    })
  }

  public post: Post = {
    id: 1,
    username: "lindacind",
    userLogo: "assets/images/avatar-jessica.jpeg",
    image: "assets/images/nature.jpg",
    text: "Finally I will grade from university and start travelling around the world!",
    commentsAmount: 10
  }

  public comments: Comment[] = [
    {
      username: "lilachampoy",
      userImage: "assets/images/avatar-jessica.jpeg",
      text: "Wow, that`s really cool. Could you tell more about this accident? Wow, that`s really cool. Could you tell more about this accident?" +
        " Wow, that`s really cool. Could you tell more about this accident? Wow, that`s really cool. " +
        "Could you tell more about this accident?"
    },
    {
      username: "biggiboss",
      text: "Really cool.",
      userImage: "assets/images/avatar-jessica.jpeg",
    }
  ]
}

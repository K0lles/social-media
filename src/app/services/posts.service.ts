import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(private http: HttpClient, private router: Router, private snackBar: MatSnackBar) { }

  async createPost(postData: {text: string, image: string | ArrayBuffer | null}) {
    this.http.post<any>("api/v1/posts/add/", postData).subscribe(
      (data) => {
        this.snackBar.open('Post was successfully created.', 'Close',
          {horizontalPosition: 'end', verticalPosition: 'top'});
      }
    )
  }

  async getMyPosts() {
    let posts: {id: number, image: string, text: string, created_at: string, comments_amount: number}[] = [];
    this.http.get<{id: number, image: string, text: string, created_at: string, comments_amount: number}[]>("api/v1/posts/my-posts/").subscribe(
      (response) => {
        for (let i = 0; i < response.length; i++) {
          posts.push(response[i]);
        }
      }
    );
    return posts;
  }

  getPostById(id: number | string) {
    return this.http.get<PostDetail>(`api/v1/posts/${id}/post-detail/`);
  }

  getPostsOfUser(userId: string | number) {
    let httpParams = new HttpParams();
    httpParams.append('user_id', userId);
    return this.http.get<Post[]>("api/v1/posts/user-posts/", {params: {user_id: userId}});
  }

  addComment(commentData: {text: string, post_id: number | string}): Observable<any> {
    return this.http.post("api/v1/posts/comments/add-comment/", commentData);
  }
}

export interface Post {
  id: number
  userLogo: string
  image: string
  username: string
  text: string
  comments_amount: number
  created_at: string
}


export interface PostDetail {
  id: number
  text: string
  image: string
  owner_username: string
  owner_image: string
  owner_id: number
  created_at: string
  comments: {text: string, username: string, user_image: string, post_id: number, created_at: string}[]
}

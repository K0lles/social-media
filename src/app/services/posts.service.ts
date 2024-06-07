import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";

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
}

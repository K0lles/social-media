import {Component, Injectable, OnInit} from '@angular/core';
import {Post} from "../post-list/post-list.component";
import {ActivatedRoute, ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from "@angular/router";
import {PostDetail, PostsService} from "../services/posts.service";
import {catchError, of} from "rxjs";
import {AuthService} from "../services/auth.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

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
  post: PostDetail | any;
  commentForm: FormGroup | any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private fb: FormBuilder,
    private postsService: PostsService
  ) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe((data) => {
      this.post = data['post'];
    });
    this.post.image = this.post.image.replace(':4200', ':8000');
    this.post.owner_image = this.post.owner_image.replace(':4200', ':8000');
    for (let comment of this.post.comments) {
      comment.user_image = comment.user_image.replace(':4200', ':8000');
    }
    this.commentForm = this.fb.group({
      comment: ['', [Validators.required, Validators.minLength(1)]]
    });
  }

  addComment(): void {
    if (this.commentForm.valid) {
      const newComment = {
        post_id: this.post.id,
        text: this.commentForm.get('comment')?.value,
      };
      this.postsService.addComment(newComment).subscribe(
        (response) => {
          if (response.user_image) {
            response.user_image = response.user_image.replace(':4200', ':8000');
          }
          this.post.comments.push(response);
      })
      // this.post.comments.push(newComment);
      this.commentForm.reset(); // Clear the form
    }
  }

  get user() {
    return this.authService.user;
  }
}


@Injectable({
  providedIn: 'root'
})
export class PostCommentsResolver implements Resolve<any> {

  constructor(private postsService: PostsService, private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const postId = route.paramMap.get('postId');
    if (!postId) {
      this.router.navigate(['']);
      return of(null);
    }
    return this.postsService.getPostById(postId).pipe(
      catchError((error) => {
        console.error('Error fetching post:', error);
        this.router.navigate(['']);
        return of(null);
      })
    );
  }
}

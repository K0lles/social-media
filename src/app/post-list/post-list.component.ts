import {Component, Injectable, OnInit} from '@angular/core';
import {AnotherPeoplePost, Post, PostsService} from "../services/posts.service";
import {ActivatedRoute, ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from "@angular/router";
import {ChatService} from "../services/chat.service";
import {catchError, Observable, of} from "rxjs";


@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit{
  public posts: AnotherPeoplePost[] = []

  constructor(private postsService: PostsService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.posts = this.route.snapshot.data['posts'];
  }

}

@Injectable({
  providedIn: 'root'
})
export class PostListResolverService implements Resolve<any> {

  constructor(private postService: PostsService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.postService.getAnotherPeoplePosts().pipe(
      catchError((error) => {
        console.error('Error fetching post:', error);
        this.router.navigate(['']);
        return of(null);
      })
    );
  }
}


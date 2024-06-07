import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {RegistrationComponent} from "./registration/registration.component";
import {PostListComponent} from "./post-list/post-list.component";
import {PostCommentsComponent} from "./post-comments/post-comments.component";
import {ChatListComponent} from "./chat-list/chat-list.component";
import {authGuard} from "./guards/auth.guard";
import {alreadyAuthedGuard} from "./guards/already-authed.guard";
import {UserUpdateComponent} from "./user-update/user-update.component";
import {PostCreateComponent} from "./post-create/post-create.component";
import {MyPostsComponent} from "./my-posts/my-posts.component";

const routes: Routes = [
  { path: "", component: PostListComponent, canActivate: [authGuard] },
  { path: "login", component: LoginComponent, canActivate: [alreadyAuthedGuard] },
  { path: "sign-up", component: RegistrationComponent, canActivate: [alreadyAuthedGuard] },
  { path: "user/update", component: UserUpdateComponent, canActivate: [authGuard] },
  { path: "comments/:postId", component: PostCommentsComponent, canActivate: [authGuard] },
  { path: "messages", component: ChatListComponent, canActivate: [authGuard] },
  { path: "post/add", component: PostCreateComponent, canActivate: [authGuard] },
  { path: "posts/my", component: MyPostsComponent, canActivate: [authGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

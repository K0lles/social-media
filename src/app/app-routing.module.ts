import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {RegistrationComponent} from "./registration/registration.component";
import {PostListComponent} from "./post-list/post-list.component";
import {PostCommentsComponent} from "./post-comments/post-comments.component";
import {ChatListComponent} from "./chat-list/chat-list.component";
import {authGuard} from "./guards/auth.guard";
import {alreadyAuthedGuard} from "./guards/already-authed.guard";

const routes: Routes = [
  { path: "", component: PostListComponent, canActivate: [authGuard] },
  { path: "login", component: LoginComponent, canActivate: [alreadyAuthedGuard] },
  { path: "sign-up", component: RegistrationComponent, canActivate: [alreadyAuthedGuard] },
  { path: "comments/:postId", component: PostCommentsComponent, canActivate: [authGuard] },
  { path: "messages", component: ChatListComponent, canActivate: [authGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

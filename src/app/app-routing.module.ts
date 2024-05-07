import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {RegistrationComponent} from "./registration/registration.component";
import {PostListComponent} from "./post-list/post-list.component";
import {PostCommentsComponent} from "./post-comments/post-comments.component";

const routes: Routes = [
  { path: "", component: PostListComponent },
  { path: "login", component: LoginComponent },
  { path: "sign-up", component: RegistrationComponent },
  { path: "comments/:postId", component: PostCommentsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

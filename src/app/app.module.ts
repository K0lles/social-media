import {APP_INITIALIZER, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from "@angular/material/card";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatInputModule} from "@angular/material/input";
import {MatButtonModule } from "@angular/material/button";
import { HeaderComponent } from './header/header.component';
import { MatIconModule } from "@angular/material/icon";
import { NgOptimizedImage } from "@angular/common";
import { RegistrationComponent } from './registration/registration.component';
import { ChatComponent } from './chat/chat.component';
import { ChatListComponent } from './chat-list/chat-list.component';
import { PostListComponent } from './post-list/post-list.component';
import { MatMenuModule } from "@angular/material/menu";
import { PostCommentsComponent } from './post-comments/post-comments.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import {AuthService} from "./services/auth.service";
import {AuthInterceptor} from "./interceptors/auth.interceptor";
import { UserUpdateComponent } from './user-update/user-update.component';
import { PostCreateComponent } from './post-create/post-create.component';
import { MyPostsComponent } from './my-posts/my-posts.component';
import { UserInfoComponent } from './user-info/user-info.component';
import { UserSubscribeComponent } from './user-subscribe/user-subscribe.component';
import { OneOneChatComponent } from './one-one-chat/one-one-chat.component';
import {MatListModule} from "@angular/material/list";
import {MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatAutocompleteModule} from "@angular/material/autocomplete";

export function initializeAppFactory(authService: AuthService) {
  return async () => {
    await authService.initialize();
  }
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    RegistrationComponent,
    ChatComponent,
    ChatListComponent,
    PostListComponent,
    PostCommentsComponent,
    UserUpdateComponent,
    PostCreateComponent,
    MyPostsComponent,
    UserInfoComponent,
    UserSubscribeComponent,
    OneOneChatComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCardModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    NgOptimizedImage,
    ReactiveFormsModule,
    MatMenuModule,
    MatSnackBarModule,
    MatListModule,
    MatDialogModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatAutocompleteModule,
  ],
  providers: [
    {provide: APP_INITIALIZER, useFactory: initializeAppFactory, deps: [AuthService], multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: MatDialogRef, useValue: {}},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

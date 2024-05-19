import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../services/auth.service";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required]],
    })
  }

  async login() {
    let loginData = {
      username: this.loginForm.controls['username'].value,
      password: this.loginForm.controls['password'].value
    };
    let response = await this.authService.login(loginData);
    if (response) {
      this.snackBar.open(
        response, 'Close', {horizontalPosition: 'right', verticalPosition: 'top'}
      );
    } else {
      await this.router.navigate([''])
    }
  }
}

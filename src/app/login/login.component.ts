import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../services/auth.service";
import {Router} from "@angular/router";

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
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required]],
    })
  }

  async login() {
    // if (!this.authService.isAuthenticated) {
      let loginData = {
        username: this.loginForm.controls['username'].value,
        password: this.loginForm.controls['password'].value
      };
      await this.authService.login(loginData);
      this.router.navigate([''])
    // }
  }
}

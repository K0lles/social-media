import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{
  loginForm: FormGroup;

  constructor(private authService: AuthService, private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required]],
    })
  }

  ngOnInit() {
  }

  login() {
    // if (!this.authService.isAuthenticated) {
      let loginData = {
        username: this.loginForm.controls['username'].value,
        password: this.loginForm.controls['password'].value
      };
      this.authService.login(loginData);
      console.log(localStorage.length);
    // }
  }
}

import { Component } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  registrationForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.registrationForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.pattern('^[a-zA-Z0-9]*$')],
      password: ['', [Validators.required]],
      repeatPassword: ['', Validators.required]
    }, { validators: [this.checkPassword]})
  }

  checkPassword(group: FormGroup) {
    let passwordValue = group.get('password')?.value;
    let repeatPasswordValue = group.get('repeatPassword')?.value;

    if (repeatPasswordValue === passwordValue) {
      group.get('repeatPassword')?.setErrors(null)
      return null;
    } else {
      group.get('repeatPassword')?.setErrors({ notSame: true})
      return {notSame: true}
    }
  }
}

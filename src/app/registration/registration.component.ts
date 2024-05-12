import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent {
  registrationForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.registrationForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.pattern('^[a-zA-Z0-9]*$')],
      password: ['', [Validators.required, Validators.minLength(6)]],
      repeatPassword: ['', [Validators.required, Validators.minLength(6)]]
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

  createAccount() {
    let loginData = {
      last_name: this.registrationForm.controls['lastName'].value,
      first_name: this.registrationForm.controls['firstName'].value,
      username: this.registrationForm.controls['username'].value,
      password: this.registrationForm.controls['password'].value
    };
    console.log(loginData);
  }

}

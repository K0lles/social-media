import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-user-update',
  templateUrl: './user-update.component.html',
  styleUrls: ['./user-update.component.scss']
})
export class UserUpdateComponent implements OnInit{
  updateForm: FormGroup;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.updateForm = this.fb.group({
      firstName: [this.authService.user?.firstName, Validators.required],
      lastName: [this.authService.user?.lastName, Validators.required],
      email: [this.authService.user?.email, [Validators.required, Validators.email]],
      image: []
    });
  }

  ngOnInit(): void {
    this.updateForm.patchValue({
      firstName: this.authService.user?.firstName,
      lastName: this.authService.user?.lastName,
      email: this.authService.user?.email,
      image: null
    });

  }

  setFileData(event: Event): void {
    const eventTarget: HTMLInputElement | null = event.target as HTMLInputElement | null;
    if (eventTarget?.files?.[0]) {
      const file: File = eventTarget.files[0];
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        this.updateForm.get('image')?.setValue(reader.result as string);
      });
      reader.readAsDataURL(file);
    }
  }

  async updateUserInfo() {
    const userInfo = {
      last_name: this.updateForm.controls['lastName'].value,
      first_name: this.updateForm.controls['firstName'].value,
      email: this.updateForm.controls['email'].value,
      image: this.updateForm.controls['image'].value
    };

    await this.authService.updateUser(userInfo);
  }

}

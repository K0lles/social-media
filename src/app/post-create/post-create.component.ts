import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss']
})
export class PostCreateComponent {
  postForm: FormGroup;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(private fb: FormBuilder) {
    this.postForm = this.fb.group({
      postText: ['', Validators.required],
      image: [null]
    });
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.postForm.patchValue({ image: file });
      this.postForm.get('image')?.updateValueAndValidity();

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
        this.postForm.patchValue({ image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  }

  clearImage(): void {
    this.imagePreview = null;
    this.postForm.patchValue({ image: null });
  }

  addPost(): void {
    const postData = {
      postText: this.postForm.controls['postText'].value,
      image: this.imagePreview
    };

    console.log(postData);
    // Add your post submission logic here
  }
}

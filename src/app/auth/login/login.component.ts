import { Component } from '@angular/core';

import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

function mustContainAmpersand(control: AbstractControl) {
  if (control.value.includes('&')) {
    return null;
  }

  return { doesNotContainAmpersand: true };
}

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  form = new FormGroup({
    emailControl: new FormControl('', {
      validators: [Validators.email, Validators.required],
    }),
    passwordControl: new FormControl('', {
      validators: [Validators.required, Validators.minLength(6), mustContainAmpersand],
    }),
  });

  public get emailIsInvalid(): boolean {
    return (
      this.form.controls.emailControl.touched &&
      this.form.controls.emailControl.dirty &&
      this.form.controls.emailControl.invalid
    );
  }

  public get passwordIsInvalid(): boolean {
    return (
      this.form.controls.passwordControl.touched &&
      this.form.controls.passwordControl.dirty &&
      this.form.controls.passwordControl.invalid
    );
  }

  onSubmit() {
    console.log(this.form);
  }
}

import { Component, DestroyRef, inject, OnInit } from '@angular/core';

import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { debounceTime, of } from 'rxjs';

function mustContainAmpersand(control: AbstractControl) {
  if (control.value.includes('&')) {
    return null;
  }

  return { doesNotContainAmpersand: true };
}

function emailIsUnique(control: AbstractControl) {
  if (control.value !== 'admin@example.com') {
    return of(null);
  }
  return of({ emailNotUnique: true });
}

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  private destroyRef = inject(DestroyRef);

  form = new FormGroup({
    emailControl: new FormControl('', {
      validators: [Validators.email, Validators.required],
      asyncValidators: [emailIsUnique],
    }),
    passwordControl: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(6),
        mustContainAmpersand,
      ],
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

  ngOnInit(): void {
    const savedForm = window.localStorage.getItem('saved-login-form');

    if (savedForm) {
      const loadedForm = JSON.parse(savedForm);
      this.form.patchValue({
        emailControl: loadedForm.email,
      });
    }

    const formSubscription = this.form.valueChanges
      .pipe(debounceTime(500))
      .subscribe({
        next: (value) => {
          window.localStorage.setItem(
            'saved-login-form',
            JSON.stringify({ email: value.emailControl })
          );
        },
      });

    this.destroyRef.onDestroy(() => {
      formSubscription.unsubscribe();
    });
  }

  onSubmit() {
    console.log(this.form);
  }
}

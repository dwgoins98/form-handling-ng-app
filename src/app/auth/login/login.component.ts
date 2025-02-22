import { Component, DestroyRef, inject, OnInit } from '@angular/core';

import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { debounceTime, of } from 'rxjs';

/**
 * Validator function to check if the control's value contains an ampersand ('&') character.
 *
 * @param control - The form control to validate.
 * @returns An object with the validation error if the value does not contain an ampersand, or null if it does.
 */
function mustContainAmpersand(control: AbstractControl) {
  if (control.value.includes('&')) {
    return null;
  }

  return { doesNotContainAmpersand: true };
}

/**
 * Validator function to check if the email is unique.
 * 
 * @param control - The form control to validate.
 * @returns An observable that emits `null` if the email is unique, 
 *          or an object with the `emailNotUnique` error if the email is not unique.
 */
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

  /**
   * Form group for the login component.
   * 
   * This form group contains two controls:
   * 
   * - `emailControl`: A form control for the email input field.
   *   - Validators: 
   *     - `Validators.email`: Ensures the input is a valid email address.
   *     - `Validators.required`: Ensures the input is not empty.
   *   - Async Validators:
   *     - `emailIsUnique`: Custom async validator to check if the email is unique.
   * 
   * - `passwordControl`: A form control for the password input field.
   *   - Validators:
   *     - `Validators.required`: Ensures the input is not empty.
   *     - `Validators.minLength(6)`: Ensures the input has a minimum length of 6 characters.
   *     - `mustContainAmpersand`: Custom validator to ensure the input contains an ampersand (`&`).
   */
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

  /**
   * Initializes the component by loading any saved form data from local storage
   * and setting up a subscription to save form changes to local storage.
   *
   * - If there is saved form data in local storage under the key 'saved-login-form',
   *   it will be parsed and used to populate the form's email control.
   * - Sets up a subscription to the form's value changes that debounces the changes
   *   by 500 milliseconds and saves the email control value to local storage under
   *   the key 'saved-login-form'.
   * - Ensures that the subscription is properly cleaned up when the component is destroyed.
   *
   * @returns {void}
   */
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


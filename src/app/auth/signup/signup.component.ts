import { Component, DestroyRef, inject } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { debounceTime, of } from 'rxjs';

/**
 * Validator function to check if the confirm password field matches the password field.
 *
 * @param control - The form control for the confirm password field.
 * @returns An object with the validation error if the passwords do not match, otherwise null.
 */
function confirmPassword(control: AbstractControl) {
  if (!control.parent) {
    return null;
  }
  const password = control.parent.get('passwordControl');
  if (password && control.value === password.value) {
    return null;
  }
  return { passwordsDoNotMatch: true };
}

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  private destroyRef = inject(DestroyRef);

  form = new FormGroup({
    emailControl: new FormControl('', {
      validators: [Validators.email, Validators.required],
    }),
    passwordControl: new FormControl('', {
      validators: [Validators.required, Validators.minLength(6)],
    }),
    confirmPasswordControl: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(6),
        confirmPassword,
      ],
    }),
    firstNameControl: new FormControl('', {
      validators: [Validators.required],
    }),
    lastNameControl: new FormControl('', { validators: [Validators.required] }),
    streetAddressControl: new FormControl('', {
      validators: [Validators.required],
    }),
    cityControl: new FormControl('', { validators: [Validators.required] }),
    stateControl: new FormControl('', { validators: [Validators.required] }),
    zipCodeControl: new FormControl('', { validators: [Validators.required] }),
    roleControl: new FormControl<
      'student' | 'teacher' | 'employe' | 'founder' | 'other'
    >('student', { validators: [Validators.required] }),
    agreeControl: new FormControl<true | false>(false, {
      validators: [Validators.required],
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

  public get confrimPasswordIsInvalid(): boolean {
    return (
      this.form.controls.confirmPasswordControl.touched &&
      this.form.controls.confirmPasswordControl.dirty &&
      this.form.controls.confirmPasswordControl.invalid
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

  onReset() {
    this.form.reset();
  }
}

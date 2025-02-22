import { Component, DestroyRef, inject } from '@angular/core';
import {
  AbstractControl,
  FormArray,
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

/**
 * Validator function to check if the roleControl field is not empty.
 *
 * @param control - The form control for the role field.
 * @returns An object with the validation error if the role is empty, otherwise null.
 */
function roleValidator(control: AbstractControl) {
  if (control.value === '') {
    return { roleRequired: true };
  }
  return null;
}

/**
 * Validator function to check if the agreeControl field is false.
 *
 * @param control - The form control for the role field.
 * @returns An object with the validation error if the role is empty, otherwise null.
 */
function agreeValidator(control: AbstractControl) {
  if (control.value === false) {
    return { agreeRequired: true };
  }
  return null;
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

    passwords: new FormGroup({
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
    }),

    name: new FormGroup({
      firstNameControl: new FormControl('', {
        validators: [Validators.required],
      }),
      lastNameControl: new FormControl('', {
        validators: [Validators.required],
      }),
    }),

    address: new FormGroup({
      streetAddressControl: new FormControl('', {
        validators: [Validators.required],
      }),
      cityControl: new FormControl('', { validators: [Validators.required] }),
      stateControl: new FormControl('', { validators: [Validators.required] }),
      zipCodeControl: new FormControl('', {
        validators: [Validators.required],
      }),
    }),

    roleControl: new FormControl<
      '' | 'student' | 'teacher' | 'employe' | 'founder' | 'other'
    >('', { validators: [Validators.required, roleValidator] }),

    sourceControl: new FormArray([
      new FormControl(false),
      new FormControl(false),
      new FormControl(false),
    ]),

    agreeControl: new FormControl<true | false>(false, {
      validators: [Validators.required, agreeValidator],
    }),
  });

  public get emailIsInvalid(): boolean {
    return (
      this.form.controls.emailControl.touched &&
      this.form.controls.emailControl.dirty &&
      this.form.controls.emailControl.invalid
    );
  }

  public get passwordIsInvalid(): boolean | undefined {
    return (
      this.form.controls.passwords.get('passwordControl')?.touched &&
      this.form.controls.passwords.get('passwordControl')?.dirty &&
      this.form.controls.passwords.get('passwordControl')?.invalid
    );
  }

  public get confrimPasswordIsInvalid(): boolean | undefined {
    return (
      this.form.controls.passwords.get('confirmPasswordControl')?.touched &&
      this.form.controls.passwords.get('confirmPasswordControl')?.dirty &&
      this.form.controls.passwords.get('confirmPasswordControl')?.invalid
    );
  }

  public get firstNameIsInvalid(): boolean | undefined {
    return (
      this.form.controls.name.get('firstNameControl')?.touched &&
      this.form.controls.name.get('firstNameControl')?.dirty &&
      this.form.controls.name.get('firstNameControl')?.invalid
    );
  }

  public get lastNameIsInvalid(): boolean | undefined {
    return (
      this.form.controls.name.get('lastNameControl')?.touched &&
      this.form.controls.name.get('lastNameControl')?.dirty &&
      this.form.controls.name.get('lastNameControl')?.invalid
    );
  }

  public get streetAddressIsInvalid(): boolean | undefined {
    return (
      this.form.controls.address.get('streetAddressControl')?.touched &&
      this.form.controls.address.get('streetAddressControl')?.dirty &&
      this.form.controls.address.get('streetAddressControl')?.invalid
    );
  }

  public get cityIsInvalid(): boolean | undefined {
    return (
      this.form.controls.address.get('cityControl')?.touched &&
      this.form.controls.address.get('cityControl')?.dirty &&
      this.form.controls.address.get('cityControl')?.invalid
    );
  }

  public get stateIsInvalid(): boolean | undefined {
    return (
      this.form.controls.address.get('stateControl')?.touched &&
      this.form.controls.address.get('stateControl')?.dirty &&
      this.form.controls.address.get('stateControl')?.invalid
    );
  }

  public get zipCodeIsInvalid(): boolean | undefined {
    return (
      this.form.controls.address.get('zipCodeControl')?.touched &&
      this.form.controls.address.get('zipCodeControl')?.dirty &&
      this.form.controls.address.get('zipCodeControl')?.invalid
    );
  }

  public get roleIsInvalid(): boolean {
    return (
      this.form.controls.roleControl.touched &&
      this.form.controls.roleControl.invalid
    );
  }

  public get agreeIsInvalid(): boolean {
    return (
      this.form.controls.agreeControl.dirty &&
      this.form.controls.agreeControl.invalid
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
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      console.log('FORM INVALID');
      return;
    }
    console.log(this.form);
  }

  onReset() {
    this.form.reset();
  }
}

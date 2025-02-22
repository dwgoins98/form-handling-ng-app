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
function confirmPasswordValidator(control: AbstractControl) {
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

  /**
   * FormGroup representing the signup form.
   * 
   * Controls:
   * - `emailControl`: FormControl for the email address with email and required validators.
   * - `passwords`: FormGroup containing:
   *   - `passwordControl`: FormControl for the password with required and minLength(6) validators.
   *   - `confirmPasswordControl`: FormControl for confirming the password with required, minLength(6), and custom confirmPasswordValidator.
   * - `name`: FormGroup containing:
   *   - `firstNameControl`: FormControl for the first name with required validator.
   *   - `lastNameControl`: FormControl for the last name with required validator.
   * - `address`: FormGroup containing:
   *   - `streetAddressControl`: FormControl for the street address with required validator.
   *   - `cityControl`: FormControl for the city with required validator.
   *   - `stateControl`: FormControl for the state with required validator.
   *   - `zipCodeControl`: FormControl for the zip code with required validator.
   * - `roleControl`: FormControl for the role with required and custom roleValidator. Possible values are: '', 'student', 'teacher', 'employe', 'founder', 'other'.
   * - `sourceControl`: FormArray containing three FormControls for source options, all initialized to false.
   * - `agreeControl`: FormControl for agreement with required and custom agreeValidator. Possible values are true or false.
   */
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
          confirmPasswordValidator,
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

/**
* Getters for the Signup Template's error messaging to make sure all validators are met
*/
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
      // this.form.controls.passwords.get('confirmPasswordControl')?.touched &&
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

  /**
   * Initializes the component by loading any saved form data from local storage
   * and setting up a subscription to save form changes to local storage.
   *
   * - If there is saved form data in local storage, it populates the form with the saved email.
   * - Sets up a subscription to the form's value changes, debounced by 500ms, to save the email to local storage.
   * - Unsubscribes from the form value changes subscription when the component is destroyed.
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

  /**
   * Handles the form submission event.
   * 
   * This method marks all form controls as touched to trigger validation messages.
   * If the form is invalid, it logs 'FORM INVALID' to the console and exits.
   * Otherwise, it logs the form object to the console.
   */
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

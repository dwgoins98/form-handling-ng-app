import {
  afterNextRender,
  Component,
  DestroyRef,
  viewChild,
} from '@angular/core';

import { FormsModule, NgForm } from '@angular/forms';
import { debounceTime, Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  // Template Driven approach
  private form = viewChild<NgForm>('formTemplateVar'); // viewChild is a signal

  private formSubscription: Subscription | undefined;

  /**
   * Constructor for the LoginComponent.
   * 
   * @param destroyRef - A reference to the DestroyRef service for handling cleanup.
   * 
   * This constructor performs the following tasks:
   * 1. After the next render, it checks if there is any saved form data in the local storage.
   *    - If saved data is found, it populates the form with the saved email.
   * 2. Subscribes to form value changes and saves the email to local storage if the user stops typing for half a second.
   * 3. Unsubscribes from the form value changes subscription when the component is destroyed.
   */
  constructor(private destroyRef: DestroyRef) {
    afterNextRender(() => {
      const savedForm = window.localStorage.getItem('saved-login-form');

      // Import saved data into the form if the page is reloaded
      if (savedForm) {
        const loadedFormData = JSON.parse(savedForm);
        const savedEmail = loadedFormData.email;
        setTimeout(() => {
          this.form()?.controls['email'].setValue(savedEmail);
        }, 1);
      }

      this.formSubscription = this.form()
        ?.valueChanges?.pipe(debounceTime(500)) // If the user stops typing for half a second, the new value is stored in local storage
        .subscribe({
          next: (value) =>
            window.localStorage.setItem(
              'saved-login-form',
              JSON.stringify({ email: value.email })
            ),
        });
    });

    destroyRef.onDestroy(() => {
      this.formSubscription?.unsubscribe();
    });
  }

  onSubmit(formData: NgForm) {
    if (formData.form.invalid) {
      return;
    }

    const eneteredEmail: string = formData.value.email;
    const enteredPassword: string = formData.value.password;

    console.log(formData.form);
    console.log('Email: ' + eneteredEmail);
    console.log('Password: ' + enteredPassword);

    formData.form.reset();
  }
}

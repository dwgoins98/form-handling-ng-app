import { Component } from '@angular/core';

import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  // Template Driven approach

  onSubmit(formData: NgForm) {

    const eneteredEmail: string = formData.value.email;
    const enteredPassword: string = formData.value.password;

    console.log("Email: " + eneteredEmail);
    console.log("Password: " + enteredPassword);
  }
}

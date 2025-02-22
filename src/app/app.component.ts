import { Component } from '@angular/core';
import { LoginComponent } from "./auth/login/login.component";
import { SignupComponent } from "./auth/signup/signup.component";

@Component({
  selector: 'app-root',
  imports: [LoginComponent, SignupComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'form-handling-ng-app';
}

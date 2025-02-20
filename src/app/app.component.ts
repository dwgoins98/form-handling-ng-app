import { Component } from '@angular/core';
import { LoginComponent } from "./auth/login/login.component";

@Component({
  selector: 'app-root',
  imports: [LoginComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'form-handling-ng-app';
}

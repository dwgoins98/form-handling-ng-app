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
export class LoginComponent {}

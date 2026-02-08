import {
  Component,
  ElementRef,
  signal,
  ViewChild,
  viewChild,
} from '@angular/core';
import { AuthService } from '../../../common/services/auth.service';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { finalize, takeUntil } from 'rxjs';
import { BaseComponent } from '../../../common/directives/base-component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent extends BaseComponent {
  isLoggingIn = signal<boolean>(false);
  formData = viewChild<LoginFormComponent>('formData');
  errorMessage = signal<string>('');

  constructor(private authSvc: AuthService, private router: Router) {
    super();
  }

  onLogin($event: boolean) {
    const form = this.formData()?.form;
    if (!form || form.invalid) {
      form?.markAllAsTouched();
      return;
    }

    this.errorMessage.set('');
    this.isLoggingIn.set(true);
    form.disable();

    this.authSvc
      .loginUser(this.formData()?.emailAddress.value, this.formData()?.password.value)
      .pipe(
        finalize(() => {
          this.isLoggingIn.set(false);
          form.enable();
        }),
        takeUntil(this.unsubscribe)
      )
      .subscribe({
        next: (resp) => {
          localStorage.setItem('RLCCAT', resp.data.token);
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.errorMessage.set(
            error?.error?.message || 'Unable to login. Please try again.'
          );
        },
      });
  }
}

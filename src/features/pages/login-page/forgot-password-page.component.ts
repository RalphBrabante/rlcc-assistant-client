import { Component, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { finalize, takeUntil } from 'rxjs';
import { BaseComponent } from '../../../common/directives/base-component';
import { AuthService } from '../../../common/services/auth.service';

@Component({
  selector: 'app-forgot-password-page',
  templateUrl: './forgot-password-page.component.html',
  styleUrl: './forgot-password-page.component.scss',
})
export class ForgotPasswordPageComponent extends BaseComponent {
  form: FormGroup;
  isSubmitting = signal<boolean>(false);
  errorMessage = signal<string>('');
  successMessage = signal<string>('');

  constructor(private fb: FormBuilder, private authSvc: AuthService) {
    super();
    this.form = this.fb.group({
      emailAddress: ['', [Validators.required, Validators.email]],
    });
  }

  get emailAddress() {
    return this.form.get('emailAddress') as FormControl;
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.errorMessage.set('');
    this.successMessage.set('');
    this.isSubmitting.set(true);

    this.authSvc
      .forgotPassword(String(this.emailAddress.value || '').trim())
      .pipe(
        finalize(() => this.isSubmitting.set(false)),
        takeUntil(this.unsubscribe)
      )
      .subscribe({
        next: (resp) => {
          this.successMessage.set(
            resp.message || 'If your account exists, a reset link has been sent.'
          );
        },
        error: (error) => {
          this.errorMessage.set(error?.error?.message || 'Unable to process request.');
        },
      });
  }
}

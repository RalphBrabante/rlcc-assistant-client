import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { finalize, takeUntil } from 'rxjs';
import { BaseComponent } from '../../../common/directives/base-component';
import { AuthService } from '../../../common/services/auth.service';

@Component({
  selector: 'app-reset-password-page',
  templateUrl: './reset-password-page.component.html',
  styleUrl: './reset-password-page.component.scss',
})
export class ResetPasswordPageComponent extends BaseComponent implements OnInit {
  form: FormGroup;
  token = signal<string>('');
  isSubmitting = signal<boolean>(false);
  errorMessage = signal<string>('');
  successMessage = signal<string>('');

  constructor(
    private fb: FormBuilder,
    private authSvc: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    super();
    this.form = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    const token = String(this.route.snapshot.queryParamMap.get('token') || '').trim();
    this.token.set(token);
  }

  get password() {
    return this.form.get('password') as FormControl;
  }

  get confirmPassword() {
    return this.form.get('confirmPassword') as FormControl;
  }

  submit() {
    if (!this.token()) {
      this.errorMessage.set('Reset token is missing.');
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.errorMessage.set('');
    this.successMessage.set('');
    this.isSubmitting.set(true);

    this.authSvc
      .resetPassword({
        token: this.token(),
        password: String(this.password.value || ''),
        confirmPassword: String(this.confirmPassword.value || ''),
      })
      .pipe(
        finalize(() => this.isSubmitting.set(false)),
        takeUntil(this.unsubscribe)
      )
      .subscribe({
        next: (resp) => {
          this.successMessage.set(resp.message || 'Password reset successful. Redirecting...');
          setTimeout(() => this.router.navigate(['/login']), 1200);
        },
        error: (error) => {
          this.errorMessage.set(error?.error?.message || 'Unable to reset password.');
        },
      });
  }
}

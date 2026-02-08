import { Component, OnInit, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import {
  UpdateUserPayload,
  UserService,
} from '../../../common/services/user.service';
import { BaseComponent } from '../../../common/directives/base-component';
import { AuthService } from '../../../common/services/auth.service';
import { delay, takeUntil } from 'rxjs';
import { Role } from '../../../common/services/role';

@Component({
  selector: 'app-edit-profile-page',
  templateUrl: './edit-profile-page.component.html',
  styleUrl: './edit-profile-page.component.scss',
})
export class EditProfilePageComponent extends BaseComponent implements OnInit {
  private readonly namePattern = /^[A-Za-z][A-Za-z\s'-]*$/;
  private readonly locationPattern = /^[A-Za-z][A-Za-z\s.'-]*$/;
  private readonly postalCodePattern = /^[A-Za-z0-9][A-Za-z0-9 -]{2,9}$/;
  private readonly passwordStrengthPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,100}$/;

  profileForm!: FormGroup;
  submitAttempted = signal<boolean>(false);
  submitError = signal<string>('');
  submitSuccess = signal<string>('');
  loading = signal<boolean>(false);
  userId = signal<string>('');
  avatar = signal<string>('');
  pcoId = signal<string>('');
  userRoles = signal<Role[]>([]);

  constructor(
    private fb: FormBuilder,
    private usrSvc: UserService,
    private authSvc: AuthService
  ) {
    super();

    this.profileForm = this.fb.group(
      {
        firstName: [
          null,
          [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(60),
            Validators.pattern(this.namePattern),
          ],
        ],
        lastName: [
          null,
          [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(60),
            Validators.pattern(this.namePattern),
          ],
        ],
        addressLine1: [null, [Validators.maxLength(120)]],
        addressLine2: [null, [Validators.maxLength(120)]],
        city: [
          null,
          [
            Validators.maxLength(80),
            Validators.pattern(this.locationPattern),
          ],
        ],
        password: [null, [Validators.pattern(this.passwordStrengthPattern)]],
        confirmPassword: [null],
        province: [
          null,
          [
            Validators.maxLength(80),
            Validators.pattern(this.locationPattern),
          ],
        ],
        postalCode: [
          null,
          [
            Validators.maxLength(10),
            Validators.pattern(this.postalCodePattern),
          ],
        ],
      },
      { validators: this.passwordValidator }
    );
  }

  passwordValidator(control: AbstractControl): ValidationErrors | null {
    const password = (control.get('password')?.value || '').trim();
    const confirmPassword = (control.get('confirmPassword')?.value || '').trim();

    if (!password && !confirmPassword) {
      return null;
    }

    if (!password && confirmPassword) {
      return { passwordRequired: true };
    }

    if (password && !confirmPassword) {
      return { confirmPasswordRequired: true };
    }

    return password === confirmPassword ? null : { mismatch: true };
  }

  get firstName() {
    return this.profileForm.get('firstName') as FormControl;
  }
  get lastName() {
    return this.profileForm.get('lastName') as FormControl;
  }

  get password() {
    return this.profileForm.get('password') as FormControl;
  }

  get confirmPassword() {
    return this.profileForm.get('confirmPassword') as FormControl;
  }
  get addressLine1() {
    return this.profileForm.get('addressLine1') as FormControl;
  }

  get addressLine2() {
    return this.profileForm.get('addressLine2') as FormControl;
  }

  get city() {
    return this.profileForm.get('city') as FormControl;
  }

  get province() {
    return this.profileForm.get('province') as FormControl;
  }

  get postalCode() {
    return this.profileForm.get('postalCode') as FormControl;
  }

  showFieldError(controlName: string): boolean {
    const control = this.profileForm.get(controlName);

    return !!(
      control &&
      control.invalid &&
      (control.touched || control.dirty || this.submitAttempted())
    );
  }

  hasFormError(errorKey: string): boolean {
    return !!(
      this.profileForm.errors?.[errorKey] &&
      (this.submitAttempted() || this.password.touched || this.confirmPassword.touched)
    );
  }

  isSaveDisabled(): boolean {
    return this.profileForm.disabled || this.profileForm.invalid || !this.profileForm.dirty;
  }

  getPasswordRulesHint(): string {
    return '8+ chars, with uppercase, lowercase, number, and symbol.';
  }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    this.loading.set(true);
    this.submitError.set('');

    this.usrSvc
      .getUser(this.authSvc.getId())
      .pipe(delay(1000), takeUntil(this.unsubscribe))
      .subscribe({
        next: (resp) => {
          this.profileForm.patchValue({
            firstName: resp.data.firstName ?? null,
            lastName: resp.data.lastName ?? null,
            addressLine1: resp.data.addressLine1 ?? null,
            addressLine2: resp.data.addressLine2 ?? null,
            city: resp.data.city ?? null,
            province: resp.data.province ?? null,
            postalCode: resp.data.postalCode ?? null,
            password: null,
            confirmPassword: null,
          });
          this.profileForm.markAsPristine();
          this.profileForm.markAsUntouched();
          this.submitAttempted.set(false);
          this.loading.set(false);

          this.userId.set(resp.data.id.toString());
          this.avatar.set(resp.data.avatar!);
          this.pcoId.set(resp.data.pcoId!);
          this.userRoles.set(resp.data.roles!);
        },
        error: (error) => {
          this.loading.set(false);
          this.submitError.set(error?.error?.message || 'Unable to load your profile.');
        },
      });
  }

  private normalizeOptionalField(value: string | null | undefined): string | null {
    const trimmed = value?.trim() ?? '';
    return trimmed ? trimmed : null;
  }

  private buildPayload(): UpdateUserPayload {
    const payload: UpdateUserPayload = {
      firstName: this.firstName.value?.trim(),
      lastName: this.lastName.value?.trim(),
      addressLine1: this.normalizeOptionalField(this.addressLine1.value),
      addressLine2: this.normalizeOptionalField(this.addressLine2.value),
      city: this.normalizeOptionalField(this.city.value),
      province: this.normalizeOptionalField(this.province.value),
      postalCode: this.normalizeOptionalField(this.postalCode.value),
    };

    const password = this.password.value?.trim();
    const confirmPassword = this.confirmPassword.value?.trim();

    if (password) {
      payload.password = password;
      payload.confirmPassword = confirmPassword;
    }

    return payload;
  }

  onSubmit() {
    this.submitAttempted.set(true);
    this.submitError.set('');
    this.submitSuccess.set('');

    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    if (!this.profileForm.dirty) {
      this.submitSuccess.set('No changes detected.');
      return;
    }

    this.profileForm.disable();
    this.usrSvc
      .updateUser(this.userId(), this.buildPayload())
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: () => {
          this.submitSuccess.set('Profile updated successfully.');
          this.profileForm.enable();
          this.fetchData();
          this.password.reset();
          this.confirmPassword.reset();
        },
        error: (error) => {
          this.submitError.set(error?.error?.message || 'Unable to update profile.');
          this.profileForm.enable();
        },
      });
  }
}

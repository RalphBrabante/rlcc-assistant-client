import { Component, OnInit, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { UserService } from '../../../common/services/user.service';
import { BaseComponent } from '../../../common/directives/base-component';
import { AuthService } from '../../../common/services/auth.service';
import { delay, takeUntil } from 'rxjs';

@Component({
  selector: 'app-edit-profile-page',
  templateUrl: './edit-profile-page.component.html',
  styleUrl: './edit-profile-page.component.scss',
})
export class EditProfilePageComponent extends BaseComponent implements OnInit {
  profileForm!: FormGroup;
  loading = signal<boolean>(false);
  userId = signal<string>('');

  constructor(
    private fb: FormBuilder,
    private usrSvc: UserService,
    private authSvc: AuthService
  ) {
    super();

    this.profileForm = this.fb.group(
      {
        firstName: [null, Validators.required],
        lastName: [null, Validators.required],
        addressLine1: [null],
        addressLine2: [null],
        city: [null],
        password: [null],
        confirmPassword: [null],
        province: [null],
        postalCode: [null],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
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

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    this.loading.set(true);

    this.usrSvc
      .getUser(this.authSvc.getId())
      .pipe(delay(1000), takeUntil(this.unsubscribe))
      .subscribe({
        next: (resp) => {
          this.firstName.setValue(resp.data.firstName);
          this.lastName.setValue(resp.data.lastName);
          this.addressLine1.setValue(resp.data.addressLine1);
          this.addressLine2.setValue(resp.data.addressLine2);
          this.city.setValue(resp.data.city);
          this.province.setValue(resp.data.province);
          this.postalCode.setValue(resp.data.postalCode);
          this.loading.set(false);

          this.userId.set(resp.data.id.toString());
        },
      });
  }

  onSubmit() {
    if (this.profileForm.valid  && this.profileForm.touched) {
      this.profileForm.disable();
      this.usrSvc
        .updateUser(this.userId(), this.profileForm.value)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe({
          next: (resp) => {
            console.log(resp);
            this.profileForm.enable();
            this.fetchData();
            this.password.reset();
            this.confirmPassword.reset();
          },
        });
    }
  }
}

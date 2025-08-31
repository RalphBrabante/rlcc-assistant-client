import { Component, input, output, signal } from '@angular/core';
import { BaseComponent } from '../../../../../common/directives/base-component';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss',
})
export class LoginFormComponent extends BaseComponent {
  form!: FormGroup;
  submitEventEmitter = output<boolean>()
  errorMessage = input<string>('');

  constructor(private fb: FormBuilder) {
    super();

    this.form = this.fb.group({
      emailAddress: [null, [Validators.email, Validators.required]],
      password: [null, [Validators.required]],
    });
  }

  get emailAddress() {
    return this.form.get('emailAddress') as FormControl;
  }

  get password() {
    return this.form.get('password') as FormControl;
  }

  onSubmit(){
    this.submitEventEmitter.emit(true);
  }

  
}

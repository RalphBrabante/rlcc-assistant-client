import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginPageRoutingModule } from './login-page-routing.module';
import { LoginPageComponent } from './login-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { NgbAlert } from "../../../../node_modules/@ng-bootstrap/ng-bootstrap/alert/alert";
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [LoginPageComponent, LoginFormComponent],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    LoginPageRoutingModule,
    NgbAlertModule
]
})
export class LoginPageModule { }

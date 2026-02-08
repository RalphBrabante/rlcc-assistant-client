import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RolesPermissionsPageComponent } from './roles-permissions-page.component';
import { RolesPermissionsPageRoutingModule } from './roles-permissions-page-routing.module';

@NgModule({
  declarations: [RolesPermissionsPageComponent],
  imports: [CommonModule, ReactiveFormsModule, RolesPermissionsPageRoutingModule],
})
export class RolesPermissionsPageModule {}

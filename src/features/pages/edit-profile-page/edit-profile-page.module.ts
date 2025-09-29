import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditProfilePageRoutingModule } from './edit-profile-page-routing.module';
import { EditProfilePageComponent } from './edit-profile-page.component';
import { DashboardHeaderModule } from '../../../common/components/dashboard-header/dashboard-header.module';

@NgModule({
  declarations: [EditProfilePageComponent],
  imports: [DashboardHeaderModule, CommonModule, EditProfilePageRoutingModule],
})
export class EditProfilePageModule {}

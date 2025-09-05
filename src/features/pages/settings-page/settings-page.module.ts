import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsPageRoutingModule } from './settings-page-routing.module';
import { SettingsPageComponent } from './settings-page.component';
import { DashboardHeaderModule } from '../../../common/components/dashboard-header/dashboard-header.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [SettingsPageComponent],
  imports: [
    CommonModule,
    DashboardHeaderModule,
    FormsModule,
    ReactiveFormsModule,
    SettingsPageRoutingModule,
  ],
})
export class SettingsPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardPageRoutingModule } from './dashboard-page-routing.module';
import { DashboardPageComponent } from './dashboard-page.component';
import { DashboardHeaderModule } from '../../../common/components/dashboard-header/dashboard-header.module';
@NgModule({
  declarations: [DashboardPageComponent],
  imports: [DashboardHeaderModule, CommonModule, DashboardPageRoutingModule],
})
export class DashboardPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardPageRoutingModule } from './dashboard-page-routing.module';
import { DashboardPageComponent } from './dashboard-page.component';
import { DashboardHeaderModule } from '../../../common/components/dashboard-header/dashboard-header.module';
import { UserTitheChartComponent } from './components/user-tithe-chart/user-tithe-chart.component';
import {
  provideCharts,
  withDefaultRegisterables,
  BaseChartDirective,
} from 'ng2-charts';
import { AllTitheChartComponent } from './components/all-tithe-chart/all-tithe-chart.component';

@NgModule({
  declarations: [DashboardPageComponent, UserTitheChartComponent, AllTitheChartComponent],
  imports: [
    BaseChartDirective,
    DashboardHeaderModule,
    CommonModule,
    DashboardPageRoutingModule,
  ],
  providers: [provideCharts(withDefaultRegisterables())],
})
export class DashboardPageModule {}

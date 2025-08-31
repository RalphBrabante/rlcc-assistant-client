import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TithesPageRoutingModule } from './tithes-page-routing.module';
import { TithesPageComponent } from './tithes-page.component';
import { DashboardHeaderModule } from '../../../common/components/dashboard-header/dashboard-header.module';
import { TithesTableComponent } from './components/tithes-table/tithes-table.component';


@NgModule({
  declarations: [TithesPageComponent, TithesTableComponent],
  imports: [
    DashboardHeaderModule,
    CommonModule,
    TithesPageRoutingModule
  ]
})
export class TithesPageModule { }

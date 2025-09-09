import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CirclesPageRoutingModule } from './circles-page-routing.module';
import { CirclesPageComponent } from './circles-page.component';
import { DashboardHeaderModule } from "../../../common/components/dashboard-header/dashboard-header.module";
import { CirclesTableComponent } from './components/circles-table/circles-table.component';


@NgModule({
  declarations: [CirclesPageComponent, CirclesTableComponent],
  imports: [
    CommonModule,
    CirclesPageRoutingModule,
    DashboardHeaderModule
]
})
export class CirclesPageModule { }

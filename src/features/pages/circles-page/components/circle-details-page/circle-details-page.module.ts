import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CircleDetailsPageRoutingModule } from './circle-details-page-routing.module';
import { CircleDetailsPageComponent } from './circle-details-page.component';
import { DashboardHeaderModule } from "../../../../../common/components/dashboard-header/dashboard-header.module";


@NgModule({
  declarations: [CircleDetailsPageComponent],
  imports: [
    CommonModule,
    CircleDetailsPageRoutingModule,
    DashboardHeaderModule
]
})
export class CircleDetailsPageModule { }

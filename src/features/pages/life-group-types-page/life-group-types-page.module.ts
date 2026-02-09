import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { LifeGroupTypesPageRoutingModule } from './life-group-types-page-routing.module';
import { LifeGroupTypesPageComponent } from './life-group-types-page.component';
import { DashboardHeaderModule } from "../../../common/components/dashboard-header/dashboard-header.module";


@NgModule({
  declarations: [LifeGroupTypesPageComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LifeGroupTypesPageRoutingModule,
    DashboardHeaderModule
]
})
export class LifeGroupTypesPageModule { }

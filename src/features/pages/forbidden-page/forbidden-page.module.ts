import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForbiddenPageComponent } from './forbidden-page.component';
import { DashboardHeaderModule } from "../../../common/components/dashboard-header/dashboard-header.module";
import { ForbiddenPageRoutingModule } from './forbidden-page-routing.module';



@NgModule({
  declarations: [ForbiddenPageComponent],
  imports: [
    CommonModule,
    DashboardHeaderModule,
    ForbiddenPageRoutingModule
  ],
  exports:[ForbiddenPageComponent]
})
export class ForbiddenPageModule { }

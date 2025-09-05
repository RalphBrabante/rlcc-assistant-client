import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TitheTypePageRoutingModule } from './tithe-type-page-routing.module';
import { TitheTypeTableComponent } from './components/tithe-type-table/tithe-type-table.component';
import { DashboardHeaderModule } from '../../../common/components/dashboard-header/dashboard-header.module';
import { TitheTypePageComponent } from './tithe-type-page.component';
import { CreateTitheTypeModalComponent } from './components/create-tithe-type-modal/create-tithe-type-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbAlert, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    CreateTitheTypeModalComponent,
    TitheTypeTableComponent,
    TitheTypePageComponent,
  ],
  imports: [
    NgbTooltip,
    NgbAlert,
    ReactiveFormsModule,
    CommonModule,
    TitheTypePageRoutingModule,
    DashboardHeaderModule,
  ],
})
export class TitheTypePageModule {

  
}

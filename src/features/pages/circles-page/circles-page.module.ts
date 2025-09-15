import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CirclesPageRoutingModule } from './circles-page-routing.module';
import { CirclesPageComponent } from './circles-page.component';
import { DashboardHeaderModule } from '../../../common/components/dashboard-header/dashboard-header.module';
import { CirclesTableComponent } from './components/circles-table/circles-table.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CreateCircleModalComponent } from './components/create-circle-modal/create-circle-modal.component';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { RouterLink } from '@angular/router';

@NgModule({
  declarations: [
    CreateCircleModalComponent,
    CirclesPageComponent,
    CirclesTableComponent,
  ],
  imports: [
    NgbTooltip,
    RouterLink,
    ReactiveFormsModule,
    CommonModule,
    CirclesPageRoutingModule,
    DashboardHeaderModule,
  ],
})
export class CirclesPageModule {}

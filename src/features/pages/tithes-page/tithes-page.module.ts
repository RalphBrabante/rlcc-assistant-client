import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TithesPageRoutingModule } from './tithes-page-routing.module';
import { TithesPageComponent } from './tithes-page.component';
import { DashboardHeaderModule } from '../../../common/components/dashboard-header/dashboard-header.module';
import { TithesTableComponent } from './components/tithes-table/tithes-table.component';
import { UserTithesTableComponent } from './components/user-tithes-table/user-tithes-table.component';
import { PaginationModule } from '../../../common/components/pagination/pagination.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    TithesPageComponent,
    TithesTableComponent,
    UserTithesTableComponent,
  ],
  imports: [
    FormsModule,
    PaginationModule,
    DashboardHeaderModule,
    CommonModule,
    TithesPageRoutingModule,
    PaginationModule,
  ],
})
export class TithesPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TithesPageRoutingModule } from './tithes-page-routing.module';
import { TithesPageComponent } from './tithes-page.component';
import { DashboardHeaderModule } from '../../../common/components/dashboard-header/dashboard-header.module';
import { TithesTableComponent } from './components/tithes-table/tithes-table.component';
import { UserTithesTableComponent } from './components/user-tithes-table/user-tithes-table.component';
import { PaginationModule } from '../../../common/components/pagination/pagination.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddNewTitheModalComponent } from './components/add-new-tithe-modal/add-new-tithe-modal.component';
import { ActiveMembersLookupDropdownModule } from '../../../common/components/active-members-lookup-dropdown/active-members-lookup-dropdown.module';
import { ActiveTitheTypeDropdownModule } from "../../../common/components/active-tithe-type-dropdown/active-tithe-type-dropdown.module";

@NgModule({
  declarations: [
    TithesPageComponent,
    TithesTableComponent,
    UserTithesTableComponent,
    AddNewTitheModalComponent
  ],
  imports: [
    ActiveMembersLookupDropdownModule,
    ActiveTitheTypeDropdownModule,
    ReactiveFormsModule,
    FormsModule,
    PaginationModule,
    DashboardHeaderModule,
    CommonModule,
    TithesPageRoutingModule,
    PaginationModule,
    ActiveTitheTypeDropdownModule
],
})
export class TithesPageModule {}

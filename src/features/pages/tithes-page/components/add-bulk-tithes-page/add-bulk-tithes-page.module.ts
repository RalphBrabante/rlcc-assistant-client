import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddBulkTithesPageRoutingModule } from './add-bulk-tithes-page-routing.module';
import { DashboardHeaderModule } from '../../../../../common/components/dashboard-header/dashboard-header.module';
import { ActiveMembersLookupDropdownModule } from '../../../../../common/components/active-members-lookup-dropdown/active-members-lookup-dropdown.module';
import { ActiveTitheTypeDropdownModule } from '../../../../../common/components/active-tithe-type-dropdown/active-tithe-type-dropdown.module';

@NgModule({
  declarations: [],
  imports: [
    ActiveTitheTypeDropdownModule,
    ActiveMembersLookupDropdownModule,
    DashboardHeaderModule,
    CommonModule,
    AddBulkTithesPageRoutingModule,
  ],
})
export class AddBulkTithesPageModule {

  
}

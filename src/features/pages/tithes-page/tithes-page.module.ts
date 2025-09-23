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
import { DeleteConfirmationModalModule } from '../../../common/components/delete-confirmation-modal/delete-confirmation-modal.module';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { EditTithePageComponent } from './components/edit-tithe-page/edit-tithe-page.component';
import { AddBulkTithesPageComponent } from './components/add-bulk-tithes-page/add-bulk-tithes-page.component';
import { VerseContainerModule } from "../../../common/components/verse-container/verse-container.module";

@NgModule({
  declarations: [
    TithesPageComponent,
    TithesTableComponent,
    UserTithesTableComponent,
    AddNewTitheModalComponent,
    EditTithePageComponent,
    AddBulkTithesPageComponent
  ],
  imports: [
    NgbTooltip,
    DeleteConfirmationModalModule,
    ActiveMembersLookupDropdownModule,
    ActiveTitheTypeDropdownModule,
    ReactiveFormsModule,
    FormsModule,
    PaginationModule,
    DashboardHeaderModule,
    CommonModule,
    TithesPageRoutingModule,
    PaginationModule,
    ActiveTitheTypeDropdownModule,
    VerseContainerModule
],
})
export class TithesPageModule {}

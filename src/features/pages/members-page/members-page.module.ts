import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { MembersPageRoutingModule } from './members-page-routing.module';
import { MembersPageComponent } from './members-page.component';
import { DashboardHeaderModule } from '../../../common/components/dashboard-header/dashboard-header.module';
import { PaginationModule } from '../../../common/components/pagination/pagination.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CreateMemberModalComponent } from './components/create-member-modal/create-member-modal.component';

@NgModule({
  declarations: [MembersPageComponent, CreateMemberModalComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MembersPageRoutingModule,
    DashboardHeaderModule,
    PaginationModule,
    NgbModule,
  ],
})
export class MembersPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CircleDetailsPageRoutingModule } from './circle-details-page-routing.module';
import { CircleDetailsPageComponent } from './circle-details-page.component';
import { DashboardHeaderModule } from '../../../../../common/components/dashboard-header/dashboard-header.module';
import { AssignCirlceMembersModalComponent } from '../assign-cirlce-members-modal/assign-cirlce-members-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CircleMemberSearchFieldComponent } from '../circle-member-search-field/circle-member-search-field.component';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { CircleChatPanelComponent } from '../circle-chat-panel/circle-chat-panel.component';

@NgModule({
  declarations: [
    CircleMemberSearchFieldComponent,
    CircleChatPanelComponent,
    AssignCirlceMembersModalComponent,
    CircleDetailsPageComponent,
  ],
  imports: [
    NgbTooltip,
    ReactiveFormsModule,
    CommonModule,
    CircleDetailsPageRoutingModule,
    DashboardHeaderModule,
  ],
})
export class CircleDetailsPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CircleTopicsPageRoutingModule } from './circle-topics-page-routing.module';
import { CircleTopicsPageComponent } from './circle-topics-page.component';
import { CircleTopicDetailsPageComponent } from './circle-topic-details-page.component';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [CircleTopicsPageComponent, CircleTopicDetailsPageComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    NgbTooltip,
    CircleTopicsPageRoutingModule,
  ],
})
export class CircleTopicsPageModule {}

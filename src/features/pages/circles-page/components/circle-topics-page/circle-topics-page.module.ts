import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CircleTopicsPageRoutingModule } from './circle-topics-page-routing.module';
import { CircleTopicsPageComponent } from './circle-topics-page.component';

@NgModule({
  declarations: [CircleTopicsPageComponent],
  imports: [CommonModule, CircleTopicsPageRoutingModule],
})
export class CircleTopicsPageModule {}

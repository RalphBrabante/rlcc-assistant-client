import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TitheSinglePageRoutingModule } from './tithe-single-page-routing.module';
import { TitheSinglePageComponent } from './tithe-single-page.component';
import { DashboardHeaderModule } from '../../../../../common/components/dashboard-header/dashboard-header.module';
import { VerseContainerModule } from '../../../../../common/components/verse-container/verse-container.module';

@NgModule({
  declarations: [TitheSinglePageComponent],
  imports: [VerseContainerModule,DashboardHeaderModule, CommonModule, TitheSinglePageRoutingModule],
})
export class TitheSinglePageModule {}

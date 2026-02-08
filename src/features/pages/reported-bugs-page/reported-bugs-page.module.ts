import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { ReportedBugsPageRoutingModule } from './reported-bugs-page-routing.module';
import { ReportedBugsPageComponent } from './reported-bugs-page.component';
import { ReportedBugDetailsPageComponent } from './reported-bug-details-page.component';

@NgModule({
  declarations: [ReportedBugsPageComponent, ReportedBugDetailsPageComponent],
  imports: [CommonModule, ReactiveFormsModule, ReportedBugsPageRoutingModule],
})
export class ReportedBugsPageModule {}

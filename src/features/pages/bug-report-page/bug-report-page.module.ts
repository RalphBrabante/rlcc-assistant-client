import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { BugReportPageRoutingModule } from './bug-report-page-routing.module';
import { BugReportPageComponent } from './bug-report-page.component';

@NgModule({
  declarations: [BugReportPageComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BugReportPageRoutingModule,
  ],
})
export class BugReportPageModule {}

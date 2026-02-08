import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BugReportPageComponent } from './bug-report-page.component';

const routes: Routes = [
  {
    path: '',
    component: BugReportPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BugReportPageRoutingModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportedBugsPageComponent } from './reported-bugs-page.component';
import { ReportedBugDetailsPageComponent } from './reported-bug-details-page.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: ReportedBugsPageComponent,
  },
  {
    path: ':id',
    component: ReportedBugDetailsPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportedBugsPageRoutingModule {}

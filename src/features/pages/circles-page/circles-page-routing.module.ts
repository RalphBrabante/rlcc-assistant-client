import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CirclesPageComponent } from './circles-page.component';
import { superadminAdminGuard } from '../../../common/guards/superadmin-admin.guard';

const routes: Routes = [
  {
    path: '',
    component: CirclesPageComponent,
  },
  {
    path: 'view',
    loadChildren: () =>
      import(
        './components/circle-details-page/circle-details-page.module'
      ).then((m) => m.CircleDetailsPageModule),
  },
  {
    path: 'edit',
    canActivate: [superadminAdminGuard],
    loadChildren: () =>
      import(
        './components/edit-circle-page/edit-circle-page.module'
      ).then((m) => m.EditCirclePageModule),
  },
  {
    path: 'topics',
    canActivate: [superadminAdminGuard],
    loadChildren: () =>
      import(
        './components/circle-topics-page/circle-topics-page.module'
      ).then((m) => m.CircleTopicsPageModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CirclesPageRoutingModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TithesPageComponent } from './tithes-page.component';

const routes: Routes = [
  {
    path: '',
    component: TithesPageComponent,
  },
  {
    path: 'add-bulk',
    loadChildren: () =>
      import(
        './components/add-bulk-tithes-page/add-bulk-tithes-page-routing.module'
      ).then((m) => m.AddBulkTithesPageRoutingModule),
  },
  {
    path: ':id',
    loadChildren: () =>
      import('./components/tithe-single-page/tithe-single-page.module').then(
        (m) => m.TitheSinglePageModule
      ),
  },

  {
    path: 'edit/:id',
    loadChildren: () =>
      import('./components/edit-tithe-page/edit-tithe-page.module').then(
        (m) => m.EditTithePageModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TithesPageRoutingModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TitheTypePageComponent } from './tithe-type-page.component';

const routes: Routes = [
  {
    path: '',
    component: TitheTypePageComponent,
  },
  {
    path: 'edit/:id',
    loadChildren: () =>
      import(
        './components/edit-tithe-type-page/edit-tithe-type-page.module'
      ).then((m) => m.EditTitheTypePageModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TitheTypePageRoutingModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CirclesPageComponent } from './circles-page.component';

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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CirclesPageRoutingModule {}

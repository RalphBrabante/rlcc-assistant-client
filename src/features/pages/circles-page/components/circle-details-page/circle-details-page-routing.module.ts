import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CircleDetailsPageComponent } from './circle-details-page.component';
import { NotFoundPageComponent } from '../../../not-found-page/not-found-page.component';

const routes: Routes = [
  {
    path: ':id',
    component: CircleDetailsPageComponent,
  },
  {
    path: '**',
    component: NotFoundPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CircleDetailsPageRoutingModule {}

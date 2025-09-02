import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TitheSinglePageComponent } from './tithe-single-page.component';

const routes: Routes = [
  {
    path: '',
    component: TitheSinglePageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TitheSinglePageRoutingModule {}

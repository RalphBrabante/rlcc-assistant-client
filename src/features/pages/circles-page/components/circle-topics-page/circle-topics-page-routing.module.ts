import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CircleTopicsPageComponent } from './circle-topics-page.component';

const routes: Routes = [
  {
    path: '',
    component: CircleTopicsPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CircleTopicsPageRoutingModule {}

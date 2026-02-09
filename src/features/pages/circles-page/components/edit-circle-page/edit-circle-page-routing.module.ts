import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditCirclePageComponent } from './edit-circle-page.component';

const routes: Routes = [
  {
    path: ':id',
    component: EditCirclePageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditCirclePageRoutingModule {}

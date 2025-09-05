import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditTitheTypePageComponent } from './edit-tithe-type-page.component';

const routes: Routes = [
  {
    path: '',
    component: EditTitheTypePageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditTitheTypePageRoutingModule {}

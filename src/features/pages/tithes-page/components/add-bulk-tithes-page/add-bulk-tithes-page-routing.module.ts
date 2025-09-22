import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundPageComponent } from '../../../not-found-page/not-found-page.component';
import { AddBulkTithesPageComponent } from './add-bulk-tithes-page.component';

const routes: Routes = [
  {
    path: '',
    component: AddBulkTithesPageComponent,
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
export class AddBulkTithesPageRoutingModule {}

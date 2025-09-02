import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditTithePageComponent } from './edit-tithe-page.component';
import { adminGuard } from '../../../../../common/guards/admin.guard';

const routes: Routes = [
  {
    path: '',
    component: EditTithePageComponent,
    canActivate: [adminGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditTithePageRoutingModule {}

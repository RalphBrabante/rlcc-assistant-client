import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RolesPermissionsPageComponent } from './roles-permissions-page.component';

const routes: Routes = [
  {
    path: '',
    component: RolesPermissionsPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RolesPermissionsPageRoutingModule {}

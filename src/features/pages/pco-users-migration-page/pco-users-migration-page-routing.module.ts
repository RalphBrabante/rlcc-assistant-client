import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PcoUsersMigrationPageComponent } from './pco-users-migration-page.component';

const routes: Routes = [
  {
    path: '',
    component: PcoUsersMigrationPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PcoUsersMigrationPageRoutingModule {}

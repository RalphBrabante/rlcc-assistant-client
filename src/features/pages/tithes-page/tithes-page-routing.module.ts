import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TithesPageComponent } from './tithes-page.component';

const routes: Routes = [{
  path:'',
  component: TithesPageComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TithesPageRoutingModule { }

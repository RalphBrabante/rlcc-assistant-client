import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LifeGroupTypesPageComponent } from './life-group-types-page.component';

const routes: Routes = [{
  path:'',
  component: LifeGroupTypesPageComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LifeGroupTypesPageRoutingModule { }

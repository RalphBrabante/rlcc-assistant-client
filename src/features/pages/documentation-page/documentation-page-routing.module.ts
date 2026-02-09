import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocumentationPageComponent } from './documentation-page.component';

const routes: Routes = [
  {
    path: '',
    component: DocumentationPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocumentationPageRoutingModule {}

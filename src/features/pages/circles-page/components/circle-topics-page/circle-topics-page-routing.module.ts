import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CircleTopicsPageComponent } from './circle-topics-page.component';
import { CircleTopicDetailsPageComponent } from './circle-topic-details-page.component';

const routes: Routes = [
  {
    path: '',
    component: CircleTopicsPageComponent,
  },
  {
    path: ':topicId',
    component: CircleTopicDetailsPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CircleTopicsPageRoutingModule {}

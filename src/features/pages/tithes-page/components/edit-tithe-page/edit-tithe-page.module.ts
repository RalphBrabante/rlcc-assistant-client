import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { EditTithePageRoutingModule } from './edit-tithe-page-routing.module';
import { EditTithePageComponent } from './edit-tithe-page.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    DatePipe,
    EditTithePageRoutingModule
  ]
})
export class EditTithePageModule { }

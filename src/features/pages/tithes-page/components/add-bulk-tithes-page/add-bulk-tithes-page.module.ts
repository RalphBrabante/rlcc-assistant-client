import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddBulkTithesPageRoutingModule } from './add-bulk-tithes-page-routing.module';
import { AddBulkTithesPageComponent } from './add-bulk-tithes-page.component';


@NgModule({
  declarations: [AddBulkTithesPageComponent],
  imports: [
    CommonModule,
    AddBulkTithesPageRoutingModule
  ]
})
export class AddBulkTithesPageModule { }

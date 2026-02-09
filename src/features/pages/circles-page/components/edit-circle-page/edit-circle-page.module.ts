import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { EditCirclePageRoutingModule } from './edit-circle-page-routing.module';
import { EditCirclePageComponent } from './edit-circle-page.component';

@NgModule({
  declarations: [EditCirclePageComponent],
  imports: [CommonModule, ReactiveFormsModule, EditCirclePageRoutingModule],
})
export class EditCirclePageModule {}

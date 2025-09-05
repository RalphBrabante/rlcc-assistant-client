import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditTitheTypePageRoutingModule } from './edit-tithe-type-page-routing.module';
import { DashboardHeaderModule } from '../../../../../common/components/dashboard-header/dashboard-header.module';
import { EditTitheTypePageComponent } from './edit-tithe-type-page.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [EditTitheTypePageComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    EditTitheTypePageRoutingModule,
    DashboardHeaderModule,
  ],
})
export class EditTitheTypePageModule {}

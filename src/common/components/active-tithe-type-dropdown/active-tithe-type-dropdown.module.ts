import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActiveTitheTypeDropdownComponent } from './active-tithe-type-dropdown.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [ActiveTitheTypeDropdownComponent],
  imports: [CommonModule,FormsModule],
  exports: [ActiveTitheTypeDropdownComponent],
})
export class ActiveTitheTypeDropdownModule {}

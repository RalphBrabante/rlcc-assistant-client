import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActiveMembersLookupDropdownComponent } from './active-members-lookup-dropdown.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [ActiveMembersLookupDropdownComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [ActiveMembersLookupDropdownComponent],
})
export class ActiveMembersLookupDropdownModule {
  
}

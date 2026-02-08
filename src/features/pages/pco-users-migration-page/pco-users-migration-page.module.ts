import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { PcoUsersMigrationPageComponent } from './pco-users-migration-page.component';
import { PcoUsersMigrationPageRoutingModule } from './pco-users-migration-page-routing.module';

@NgModule({
  declarations: [PcoUsersMigrationPageComponent],
  imports: [CommonModule, ReactiveFormsModule, PcoUsersMigrationPageRoutingModule],
})
export class PcoUsersMigrationPageModule {}

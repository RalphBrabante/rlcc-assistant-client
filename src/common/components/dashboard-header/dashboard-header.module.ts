import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardHeaderComponent } from './dashboard-header.component';
import { RouterLink, RouterLinkActive } from '@angular/router';

@NgModule({
  declarations: [DashboardHeaderComponent],
  imports: [CommonModule, RouterLink, RouterLinkActive],
  exports: [DashboardHeaderComponent],
})
export class DashboardHeaderModule {}

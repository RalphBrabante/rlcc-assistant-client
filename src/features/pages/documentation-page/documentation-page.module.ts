import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocumentationPageRoutingModule } from './documentation-page-routing.module';
import { DocumentationPageComponent } from './documentation-page.component';
import { DashboardHeaderModule } from '../../../common/components/dashboard-header/dashboard-header.module';

@NgModule({
  declarations: [DocumentationPageComponent],
  imports: [CommonModule, DocumentationPageRoutingModule, DashboardHeaderModule],
})
export class DocumentationPageModule {}

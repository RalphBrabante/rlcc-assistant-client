import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {
  provideHttpClient,
  withInterceptors,
  withXsrfConfiguration,
} from '@angular/common/http';
import { httpInterceptor } from '../common/interceptors/http.interceptor';
import { DashboardHeaderModule } from "../common/components/dashboard-header/dashboard-header.module";
import { ForbiddenOverlayComponent } from '../common/components/forbidden-overlay/forbidden-overlay.component';

@NgModule({
  declarations: [AppComponent, ForbiddenOverlayComponent],
  imports: [
    BrowserModule,
    RouterModule,
    CommonModule,
    AppRoutingModule,
    NgbModule,
    DashboardHeaderModule,
],
  providers: [
    provideHttpClient(
      withInterceptors([httpInterceptor]),
      withXsrfConfiguration({
        cookieName: 'XSRF-TOKEN',
        headerName: 'X-XSRF-TOKEN',
      })
    ),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  title = 'RLCC ASSISTANT';
}

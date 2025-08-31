import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { httpInterceptor } from '../common/interceptors/http.interceptor';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule,
    CommonModule,
    AppRoutingModule,
    NgbModule,
  ],
  providers:[provideHttpClient(withInterceptors([httpInterceptor]))],
  bootstrap: [AppComponent],
})
export class AppModule {
  title = 'RLCC ASSISTANT';
}

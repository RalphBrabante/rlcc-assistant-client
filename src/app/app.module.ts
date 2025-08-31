import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, RouterModule, CommonModule, AppRoutingModule],
  bootstrap: [AppComponent]
})
export class AppModule {
  title = 'RLCC ASSISTANT';
}

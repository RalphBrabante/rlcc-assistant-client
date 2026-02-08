import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AmqpQueueViewerPageComponent } from './amqp-queue-viewer-page.component';
import { AmqpQueueViewerPageRoutingModule } from './amqp-queue-viewer-page-routing.module';

@NgModule({
  declarations: [AmqpQueueViewerPageComponent],
  imports: [CommonModule, ReactiveFormsModule, AmqpQueueViewerPageRoutingModule],
})
export class AmqpQueueViewerPageModule {}

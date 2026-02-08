import { Component, OnInit, signal } from '@angular/core';
import { BaseComponent } from '../../../common/directives/base-component';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { finalize, takeUntil } from 'rxjs';
import { QueueMessage, QueueService } from '../../../common/services/queue.service';

@Component({
  selector: 'app-amqp-queue-viewer-page',
  templateUrl: './amqp-queue-viewer-page.component.html',
  styleUrl: './amqp-queue-viewer-page.component.scss',
})
export class AmqpQueueViewerPageComponent extends BaseComponent implements OnInit {
  form: FormGroup;
  isFetching = signal<boolean>(false);
  messages = signal<QueueMessage[]>([]);
  errorMessage = signal<string>('');

  constructor(private fb: FormBuilder, private queueSvc: QueueService) {
    super();
    this.form = this.fb.group({
      queueName: ['usersMigrationQueue', [Validators.required, Validators.minLength(2)]],
    });
  }

  ngOnInit(): void {
    this.fetchQueue();
  }

  get queueName() {
    return this.form.get('queueName') as FormControl;
  }

  fetchQueue() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const queueName = (this.queueName.value || '').trim();
    if (!queueName) {
      this.queueName.setErrors({ required: true });
      return;
    }

    this.isFetching.set(true);
    this.errorMessage.set('');

    this.queueSvc
      .getQueueMessages(queueName)
      .pipe(
        finalize(() => this.isFetching.set(false)),
        takeUntil(this.unsubscribe)
      )
      .subscribe({
        next: (resp) => {
          this.messages.set(resp || []);
        },
        error: (err) => {
          this.messages.set([]);
          this.errorMessage.set(err?.error?.message || err?.error?.error || 'Unable to fetch queue messages.');
        },
      });
  }
}

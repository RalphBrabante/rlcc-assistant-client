import { Component, OnInit, signal } from '@angular/core';
import { finalize, takeUntil } from 'rxjs';
import { BaseComponent } from '../../../../../common/directives/base-component';
import { GroupService } from '../../../../../common/services/group.service';
import { GroupTopic } from '../../models/group-topic';

@Component({
  selector: 'app-circle-topics-page',
  templateUrl: './circle-topics-page.component.html',
  styleUrl: './circle-topics-page.component.scss',
})
export class CircleTopicsPageComponent extends BaseComponent implements OnInit {
  topics = signal<GroupTopic[]>([]);
  loading = signal<boolean>(false);
  errorMessage = signal<string>('');

  constructor(private groupSvc: GroupService) {
    super();
  }

  ngOnInit(): void {
    this.fetchTopics();
  }

  fetchTopics() {
    this.loading.set(true);
    this.errorMessage.set('');
    this.groupSvc
      .getAllGroupTopics()
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntil(this.unsubscribe)
      )
      .subscribe({
        next: (resp) => {
          this.topics.set(resp.data.topics || []);
        },
        error: (error) => {
          this.topics.set([]);
          this.errorMessage.set(
            error?.error?.message || 'Unable to load circle topics.'
          );
        },
      });
  }
}

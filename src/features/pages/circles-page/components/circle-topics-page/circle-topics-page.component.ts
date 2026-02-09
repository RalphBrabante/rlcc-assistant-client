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
  viewMode = signal<'card' | 'table'>('card');
  searchTerm = signal<string>('');
  selectedGroupId = signal<string>('all');
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

  setViewMode(mode: 'card' | 'table') {
    this.viewMode.set(mode);
  }

  filteredTopics(): GroupTopic[] {
    const search = this.searchTerm().trim().toLowerCase();
    const selectedGroup = this.selectedGroupId();

    return this.topics().filter((topic) => {
      const groupMatches =
        selectedGroup === 'all' || String(topic.group?.id || '') === selectedGroup;

      if (!groupMatches) return false;

      if (!search) return true;

      const haystack = [
        topic.title,
        topic.description || '',
        topic.group?.name || '',
        `${topic.creator?.firstName || ''} ${topic.creator?.lastName || ''}`,
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(search);
    });
  }

  availableGroups() {
    const map = new Map<number, string>();
    for (const topic of this.topics()) {
      const id = topic.group?.id;
      const name = topic.group?.name;
      if (id && name && !map.has(id)) {
        map.set(id, name);
      }
    }
    return [...map.entries()]
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  clearFilters() {
    this.searchTerm.set('');
    this.selectedGroupId.set('all');
  }
}

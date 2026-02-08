import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { finalize, takeUntil } from 'rxjs';
import { BaseComponent } from '../../../common/directives/base-component';
import {
  BugReportRecord,
  BugReportsMeta,
  BugReportService,
} from '../../../common/services/bug-report.service';

@Component({
  selector: 'app-reported-bugs-page',
  templateUrl: './reported-bugs-page.component.html',
  styleUrl: './reported-bugs-page.component.scss',
})
export class ReportedBugsPageComponent extends BaseComponent implements OnInit {
  readonly statusOptions = [
    { value: 'all', label: 'All' },
    { value: 'open', label: 'Open' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'rejected', label: 'Rejected' },
  ];

  filterForm: FormGroup;
  loading = signal<boolean>(false);
  refreshing = signal<boolean>(false);
  errorMessage = signal<string>('');
  successMessage = signal<string>('');
  bugReports = signal<BugReportRecord[]>([]);
  updatingIds = signal<number[]>([]);
  meta = signal<BugReportsMeta>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
  });

  constructor(private fb: FormBuilder, private bugReportSvc: BugReportService) {
    super();
    this.filterForm = this.fb.group({
      q: [''],
      status: ['all'],
    });
  }

  ngOnInit(): void {
    this.fetchBugReports(1, true);
  }

  get q() {
    return this.filterForm.get('q') as FormControl;
  }

  get status() {
    return this.filterForm.get('status') as FormControl;
  }

  private parseMeta(meta: unknown): BugReportsMeta {
    const source = (meta || {}) as Partial<BugReportsMeta>;
    const page = Number(source.page || 1);
    const limit = Number(source.limit || 20);
    const total = Number(source.total || 0);
    const totalPages = Number(source.totalPages || 1);

    return {
      page: Number.isFinite(page) && page > 0 ? page : 1,
      limit: Number.isFinite(limit) && limit > 0 ? limit : 20,
      total: Number.isFinite(total) && total >= 0 ? total : 0,
      totalPages: Number.isFinite(totalPages) && totalPages > 0 ? totalPages : 1,
    };
  }

  fetchBugReports(page: number = 1, initialLoad: boolean = false) {
    if (initialLoad) {
      this.loading.set(true);
    } else {
      this.refreshing.set(true);
    }

    this.errorMessage.set('');
    this.successMessage.set('');

    this.bugReportSvc
      .getBugReports({
        page,
        limit: this.meta().limit,
        status: this.status.value,
        q: String(this.q.value || '').trim(),
      })
      .pipe(
        finalize(() => {
          this.loading.set(false);
          this.refreshing.set(false);
        }),
        takeUntil(this.unsubscribe)
      )
      .subscribe({
        next: (resp) => {
          this.bugReports.set(resp.data?.bugReports || []);
          this.meta.set(this.parseMeta(resp.meta));
        },
        error: (error) => {
          this.bugReports.set([]);
          this.errorMessage.set(
            error?.error?.message || 'Unable to fetch bug reports.'
          );
        },
      });
  }

  onFilterSubmit() {
    this.fetchBugReports(1);
  }

  canGoPrev(): boolean {
    return this.meta().page > 1 && !this.refreshing() && !this.loading();
  }

  canGoNext(): boolean {
    return (
      this.meta().page < this.meta().totalPages &&
      !this.refreshing() &&
      !this.loading()
    );
  }

  goPrevPage() {
    if (!this.canGoPrev()) {
      return;
    }
    this.fetchBugReports(this.meta().page - 1);
  }

  goNextPage() {
    if (!this.canGoNext()) {
      return;
    }
    this.fetchBugReports(this.meta().page + 1);
  }

  isUpdating(id: number): boolean {
    return this.updatingIds().includes(id);
  }

  updateStatus(id: number, event: Event) {
    const selectedStatus = String((event.target as HTMLSelectElement).value || '').trim();
    if (!selectedStatus || this.isUpdating(id)) {
      return;
    }

    const allowed = new Set(['open', 'in_progress', 'resolved', 'rejected']);
    if (!allowed.has(selectedStatus)) {
      return;
    }

    this.errorMessage.set('');
    this.successMessage.set('');
    this.updatingIds.update((ids) => [...ids, id]);

    this.bugReportSvc
      .updateBugReportStatus(id, selectedStatus as 'open' | 'in_progress' | 'resolved' | 'rejected')
      .pipe(
        finalize(() => {
          this.updatingIds.update((ids) => ids.filter((item) => item !== id));
        }),
        takeUntil(this.unsubscribe)
      )
      .subscribe({
        next: (resp) => {
          const updated = resp.data?.bugReport;
          if (updated) {
            this.bugReports.update((rows) =>
              rows.map((row) => (row.id === id ? updated : row))
            );
            this.successMessage.set(`Bug report #${updated.id} status updated.`);
          }
        },
        error: (error) => {
          this.errorMessage.set(
            error?.error?.message || 'Unable to update bug report status.'
          );
          this.fetchBugReports(this.meta().page);
        },
      });
  }

  formatStatus(status: string): string {
    switch (status) {
      case 'in_progress':
        return 'In Progress';
      case 'resolved':
        return 'Resolved';
      case 'rejected':
        return 'Rejected';
      case 'open':
      default:
        return 'Open';
    }
  }
}

import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, takeUntil } from 'rxjs';
import { BaseComponent } from '../../../common/directives/base-component';
import {
  BugReportRecord,
  BugReportService,
} from '../../../common/services/bug-report.service';

@Component({
  selector: 'app-reported-bug-details-page',
  templateUrl: './reported-bug-details-page.component.html',
  styleUrl: './reported-bug-details-page.component.scss',
})
export class ReportedBugDetailsPageComponent
  extends BaseComponent
  implements OnInit
{
  loading = signal<boolean>(true);
  errorMessage = signal<string>('');
  bugReport = signal<BugReportRecord | null>(null);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bugReportSvc: BugReportService
  ) {
    super();
  }

  ngOnInit(): void {
    const id = Number.parseInt(String(this.route.snapshot.paramMap.get('id') || ''), 10);

    if (!Number.isInteger(id) || id < 1) {
      this.errorMessage.set('Invalid bug report ID.');
      this.loading.set(false);
      return;
    }

    this.fetchBugReport(id);
  }

  fetchBugReport(id: number) {
    this.loading.set(true);
    this.errorMessage.set('');

    this.bugReportSvc
      .getBugReportById(id)
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntil(this.unsubscribe)
      )
      .subscribe({
        next: (resp) => {
          this.bugReport.set(resp.data.bugReport);
        },
        error: (error) => {
          this.bugReport.set(null);
          this.errorMessage.set(
            error?.error?.message || 'Unable to load bug report details.'
          );
        },
      });
  }

  onBack() {
    this.router.navigate(['/reported-bugs']);
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

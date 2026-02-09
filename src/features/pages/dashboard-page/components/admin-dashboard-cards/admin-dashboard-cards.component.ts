import { Component, OnInit, signal } from '@angular/core';
import { BaseComponent } from '../../../../../common/directives/base-component';
import { UserService } from '../../../../../common/services/user.service';
import { catchError, forkJoin, of, takeUntil } from 'rxjs';
import { AuthService } from '../../../../../common/services/auth.service';
import { GroupService } from '../../../../../common/services/group.service';
import { BugReportService } from '../../../../../common/services/bug-report.service';

@Component({
  selector: 'app-admin-dashboard-cards',
  templateUrl: './admin-dashboard-cards.component.html',
  styleUrl: './admin-dashboard-cards.component.scss',
})
export class AdminDashboardCardsComponent
  extends BaseComponent
  implements OnInit
{
  activeUsersCount = signal<number>(0);
  activeGroupsCount = signal<number>(0);
  bugTotalCount = signal<number>(0);
  bugOpenCount = signal<number>(0);
  bugInProgressCount = signal<number>(0);
  bugResolvedCount = signal<number>(0);
  bugsEnabled = signal<boolean>(false);
  errorMessage = signal<string>('');

  constructor(
    private usrSvc: UserService,
    private authSvc: AuthService,
    private grpSvc: GroupService,
    private bugReportSvc: BugReportService
  ) {
    super();
    this.bugsEnabled.set(this.authSvc.isAdmin() || this.authSvc.isSuperUser());
  }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    this.usrSvc
      .countAllActiveUsers()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: (resp) => {
          this.activeUsersCount.set(resp.data.count);
        },
        error: () => {
          this.activeUsersCount.set(0);
        },
      });

    this.grpSvc
      .countAllActiveGroups()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: (resp) => {
          this.activeGroupsCount.set(Number(resp?.data?.count || 0));
        },
        error: () => {
          this.activeGroupsCount.set(0);
        },
      });

    if (this.bugsEnabled()) {
      this.fetchBugMetrics();
    }
  }

  private fetchBugMetrics() {
    forkJoin({
      total: this.bugReportSvc.getBugReports({ page: 1, limit: 1, status: 'all' }),
      open: this.bugReportSvc.getBugReports({ page: 1, limit: 1, status: 'open' }),
      inProgress: this.bugReportSvc.getBugReports({ page: 1, limit: 1, status: 'in_progress' }),
      resolved: this.bugReportSvc.getBugReports({ page: 1, limit: 1, status: 'resolved' }),
    })
      .pipe(
        catchError(() => of(null)),
        takeUntil(this.unsubscribe)
      )
      .subscribe((resp) => {
        if (!resp) {
          this.bugTotalCount.set(0);
          this.bugOpenCount.set(0);
          this.bugInProgressCount.set(0);
          this.bugResolvedCount.set(0);
          return;
        }

        const totalMeta = (resp.total as any)?.meta;
        const openMeta = (resp.open as any)?.meta;
        const inProgressMeta = (resp.inProgress as any)?.meta;
        const resolvedMeta = (resp.resolved as any)?.meta;

        this.bugTotalCount.set(Number(totalMeta?.total || 0));
        this.bugOpenCount.set(Number(openMeta?.total || 0));
        this.bugInProgressCount.set(Number(inProgressMeta?.total || 0));
        this.bugResolvedCount.set(Number(resolvedMeta?.total || 0));
      });
  }
}

import { Component, OnInit, signal } from '@angular/core';
import { BaseComponent } from '../../../../../common/directives/base-component';
import { UserService } from '../../../../../common/services/user.service';
import { takeUntil } from 'rxjs';
import { AuthService } from '../../../../../common/services/auth.service';

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

  constructor(private usrSvc: UserService, private authSvc: AuthService) {
    super();
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
          this.activeUsersCount.set(resp.count);
        },
      });
  }
}

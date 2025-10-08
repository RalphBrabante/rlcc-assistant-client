import { Component, OnInit, signal } from '@angular/core';
import { BaseComponent } from '../../directives/base-component';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { takeUntil } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-header',
  templateUrl: './dashboard-header.component.html',
  styleUrl: './dashboard-header.component.scss',
})
export class DashboardHeaderComponent extends BaseComponent implements OnInit {
  loggedInUserName = signal<string>('');
  avatarSrc = signal<string>('');
  showSubmenu = signal<boolean>(false);

  constructor(
    private authSvc: AuthService,
    private usrSvc: UserService,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.loggedInUserName.set(this.authSvc.getFullName());

    this.usrSvc
      .getUser(this.authSvc.getId())
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: (resp) => {
          this.avatarSrc.set(resp.data.avatar!);
        },
      });
  }

  onLogout() {
    this.authSvc
      .logout(localStorage.getItem('RLCCAT')!)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: (resp) => {
          localStorage.removeItem('RLCCAT');
          this.router.navigate(['/']).then(() => {
            window.location.reload(); // optional: ensures complete app reinit
          });
        },
      });
  }
  isAdmin() {
    const userRoles = this.authSvc.getRoles();
    if (
      userRoles.includes('SUPERUSER') ||
      userRoles.includes('ADMINISTRATOR') ||
      userRoles.includes('ACCOUNTANT')
    ) {
      return true;
    }
    return false;
  }

  toggleSubmenu() {
    this.showSubmenu.update((prevVal) => !prevVal);
  }
}

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
  avatarLoadFailed = signal<boolean>(false);
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
          this.avatarSrc.set(resp.data.avatar || '');
          this.avatarLoadFailed.set(false);
        },
      });
  }

  hasAvatar() {
    return !!this.avatarSrc() && !this.avatarLoadFailed();
  }

  onAvatarError() {
    this.avatarLoadFailed.set(true);
  }

  getAvatarInitials() {
    const fullName = this.loggedInUserName().trim();
    if (!fullName) {
      return 'U';
    }

    const parts = fullName.split(/\s+/).filter(Boolean);
    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }

    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }

  onLogout() {
    const token = localStorage.getItem('RLCCAT');

    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    this.authSvc
      .logout(token)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: () => {
          localStorage.removeItem('RLCCAT');
          this.router.navigate(['/login']);
        },
        error: () => {
          localStorage.removeItem('RLCCAT');
          this.router.navigate(['/login']);
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

  isSuperUser() {
    return this.authSvc.getRoles().includes('SUPERUSER');
  }

  toggleSubmenu() {
    this.showSubmenu.update((prevVal) => !prevVal);
  }
}

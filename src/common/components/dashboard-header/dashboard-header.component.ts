import { Component, OnInit, signal } from '@angular/core';
import { BaseComponent } from '../../directives/base-component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard-header',
  templateUrl: './dashboard-header.component.html',
  styleUrl: './dashboard-header.component.scss',
})
export class DashboardHeaderComponent extends BaseComponent implements OnInit {
  loggedInUserName = signal<string>('');

  showSubmenu = signal<boolean>(false);

  constructor(private authSvc: AuthService) {
    super();
  }

  ngOnInit(): void {
    this.loggedInUserName.set(this.authSvc.getFullName());
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
    this.showSubmenu.update((prevVal)=> !prevVal)
  }
}

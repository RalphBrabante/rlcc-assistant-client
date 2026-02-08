import { Component, OnInit, signal } from '@angular/core';
import { BaseComponent } from '../../../common/directives/base-component';
import { AuthService } from '../../../common/services/auth.service';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss',
})
export class DashboardPageComponent extends BaseComponent implements OnInit {
  userRoles = signal<any | undefined>(undefined);

  constructor(private authSvc: AuthService) {
    super();
  }

  ngOnInit(): void {
    this.userRoles.set(this.authSvc.getRoles());
  }

  isAdmin() {
    const roles = this.authSvc.getRoles();

    if (
      roles.includes('SUPERUSER') ||
      roles.includes('ACCOUNTANT') ||
      roles.includes('ADMIN')
    ) {
      return true;
    }
    return false;
  }


}

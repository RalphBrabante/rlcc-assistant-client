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
  constructor(private authSvc: AuthService) {
    super();
  }

  ngOnInit(): void {
    this.loggedInUserName.set(this.authSvc.getFullName());
  }
}

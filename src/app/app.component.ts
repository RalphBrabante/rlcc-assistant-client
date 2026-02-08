import { Component, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../common/services/auth.service';
import { filter } from 'rxjs';
import { ConfigurationService } from '../common/services/configuration.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  showHeader = signal<boolean>(false);
  maintenanceMode = signal<boolean>(false);
  maintenanceLockout = signal<boolean>(false);

  constructor(
    private authSvc: AuthService,
    private router: Router,
    private configurationSvc: ConfigurationService
  ) {}

  ngOnInit(): void {
    const refreshHeaderVisibility = () => {
      const isLoginRoute =
        this.router.url === '/login' ||
        this.router.url === '/' ||
        this.router.url.startsWith('/login?');
      this.showHeader.set(this.authSvc.isLoggedIn() && !isLoginRoute);
      this.refreshMaintenanceLockout();
    };

    refreshHeaderVisibility();
    this.fetchRuntimeSettings();

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        refreshHeaderVisibility();
        this.fetchRuntimeSettings();
      });
  }

  fetchRuntimeSettings() {
    this.configurationSvc.getPublicRuntimeSettings().subscribe({
      next: (resp) => {
        this.maintenanceMode.set(Boolean(resp.data.maintenanceMode));
        this.refreshMaintenanceLockout();
      },
      error: () => {
        this.maintenanceMode.set(false);
        this.refreshMaintenanceLockout();
      },
    });
  }

  private refreshMaintenanceLockout() {
    const isLoggedIn = this.authSvc.isLoggedIn();
    const isPrivileged = this.authSvc.isSuperUser() || this.authSvc.isAdmin();

    this.maintenanceLockout.set(
      this.maintenanceMode() && isLoggedIn && !isPrivileged
    );
  }
}

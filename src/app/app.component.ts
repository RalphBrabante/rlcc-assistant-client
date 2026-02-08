import { Component, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../common/services/auth.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  showHeader = signal<boolean>(false);

  constructor(private authSvc: AuthService, private router: Router) {}

  ngOnInit(): void {
    const refreshHeaderVisibility = () => {
      const isLoginRoute =
        this.router.url === '/login' ||
        this.router.url === '/' ||
        this.router.url.startsWith('/login?');
      this.showHeader.set(this.authSvc.isLoggedIn() && !isLoginRoute);
    };

    refreshHeaderVisibility();

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => refreshHeaderVisibility());
  }
}

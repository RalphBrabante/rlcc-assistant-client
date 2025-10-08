import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../common/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  isLoggedIn = signal<boolean>(false);

  constructor(private authSvc: AuthService) {
    this.isLoggedIn.set(this.authSvc.isLoggedIn());
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { baseUrl } from '../../appConfig';
import {
  AuthApiResponse,
  VerifyTokenResponse,
} from '../../features/pages/login-page/models/auth-api-response';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  exp: number; // expiration timestamp in seconds
  roles: string[];
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private verified$?: Observable<boolean>;

  constructor(private http: HttpClient) {}

  /**
   *
   * @param emailAddress - Username or Email Address
   * @param password - Password
   */
  loginUser(
    emailAddress: string,
    password: string
  ): Observable<AuthApiResponse> {
    return this.http.post<AuthApiResponse>(baseUrl + '/auth', {
      credentials: { emailAddress, password },
    });
  }

  verifyToken(): Observable<VerifyTokenResponse> {
    const token = localStorage.getItem('RLCCAT');
    return this.http.post<VerifyTokenResponse>(
      baseUrl + `/auth/verifyToken?token=${token}`,
      null
    );
  }

  clearVerification() {
    this.verified$ = undefined;
  }

  getToken(): string | null {
    return localStorage.getItem('RLCCAT');
  }

  getRoles(): string[] {
    const token = this.getToken();

    const decoded = jwtDecode<JwtPayload>(token!);

    return decoded.roles;
  }

  getFullName(): string {
    const token = this.getToken();

    const decoded = jwtDecode<JwtPayload>(token!);

    return decoded.name;
  }

  isTokenExpired(): boolean {
    const token = this.getToken();

    if (!token) return true;

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const expiry = decoded.exp * 1000; // convert to ms

      return Date.now() > expiry;
    } catch (e) {
      return true; // if invalid, treat as expired
    }
  }

  isLoggedIn(): boolean {
    return !this.isTokenExpired();
  }

  logout() {
    localStorage.removeItem('RLCCAT');
  }
}

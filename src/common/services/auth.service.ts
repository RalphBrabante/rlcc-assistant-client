import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, takeUntil } from 'rxjs';
import { baseUrl } from '../../appConfig';
import {
  AuthApiResponse,
  VerifyTokenResponse,
} from '../../features/pages/login-page/models/auth-api-response';
import { jwtDecode } from 'jwt-decode';
import { ApiResponseWithoutData } from './api-response-without-data';

interface JwtPayload {
  id: number;
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

  isSuperUser() {
    const token = this.getToken();

    const decoded = jwtDecode<JwtPayload>(token!);

    if (decoded.roles.includes('SUPERUSER')) {
      return true;
    } else {
      return false;
    }
  }

  isAdmin(): boolean {
    const token = this.getToken();

    const decoded = jwtDecode<JwtPayload>(token!);

    if (decoded.roles.includes('ADMINISTRATOR')) {
      return true;
    } else {
      return false;
    }
  }

  isAccountant(): boolean {
    const token = this.getToken();

    const decoded = jwtDecode<JwtPayload>(token!);

    console.log(decoded.roles);
    if (decoded.roles.includes('ACCOUNTANT')) {
      return true;
    } else {
      return false;
    }
  }

  getFullName(): string {
    const token = this.getToken();

    const decoded = jwtDecode<JwtPayload>(token!);

    return decoded.name;
  }

  getId(): number {
    const token = this.getToken();

    const decoded = jwtDecode<JwtPayload>(token!);

    return decoded.id;
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

  logout(token:string): Observable<ApiResponseWithoutData> {
    return this.http.delete<ApiResponseWithoutData>(`${baseUrl}/auth?token=${token}`);
  }
}

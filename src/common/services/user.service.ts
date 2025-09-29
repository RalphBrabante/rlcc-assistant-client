import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl } from '../../appConfig';
import { Observable } from 'rxjs';
import { ApiResponse } from './api-response';
import { UserApiResponse } from './user-api-response';
import { User } from './user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  getAllActiveUsers(query: string): Observable<UserApiResponse> {
    return this.http.get<UserApiResponse>(baseUrl + '/users?name=' + query);
  }

  countAllActiveUsers(): Observable<{ status: number; count: number }> {
    return this.http.get<{ status: number; count: number }>(
      baseUrl + '/users/count'
    );
  }

  getUser(id: number): Observable<{ status: number; data: User }> {
    return this.http.get<{ status: number; data: User }>(
      baseUrl + `/users/${id}`
    );
  }

  updateUser(
    id: string,
    user: User
  ): Observable<{ status: number; id: number }> {
    return this.http.patch<{ status: number; id: number }>(
      baseUrl + `/users/${id}`,
      { user }
    );
  }
}

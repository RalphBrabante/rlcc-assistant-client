import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl } from '../../appConfig';
import { Observable } from 'rxjs';
import { ApiResponse } from './api-response';
import { UserApiResponse, UserCountApiResponse } from './user-api-response';
import { User } from './user';

export interface UpdateUserPayload {
  firstName?: string | null;
  lastName?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  province?: string | null;
  postalCode?: string | null;
  password?: string;
  confirmPassword?: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  getAllActiveUsers(query: string): Observable<UserApiResponse> {
    return this.http.get<UserApiResponse>(baseUrl + '/users?name=' + query);
  }

  getMembers(params: { page: number; limit: number; query?: string }): Observable<UserApiResponse> {
    const search = new URLSearchParams();
    search.set('page', String(params.page));
    search.set('limit', String(params.limit));
    if (params.query) search.set('q', params.query);
    return this.http.get<UserApiResponse>(`${baseUrl}/users?${search.toString()}`);
  }

  countAllActiveUsers(): Observable<UserCountApiResponse> {
    return this.http.get<UserCountApiResponse>(
      baseUrl + '/users/count'
    );
  }

  getUser(id: number): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(
      baseUrl + `/users/${id}`
    );
  }

  updateUser(id: string, user: UpdateUserPayload): Observable<ApiResponse<{ id: number }>> {
    return this.http.patch<ApiResponse<{ id: number }>>(
      baseUrl + `/users/${id}`,
      { user }
    );
  }
}

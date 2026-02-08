import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl } from '../../appConfig';
import { Observable } from 'rxjs';
import { ApiResponse } from './api-response';
import { UserApiResponse, UserCountApiResponse } from './user-api-response';
import { User } from './user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  getAllActiveUsers(query: string): Observable<UserApiResponse> {
    return this.http.get<UserApiResponse>(baseUrl + '/users?name=' + query);
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

  updateUser(id: string, user: User): Observable<ApiResponse<{ id: number }>> {
    return this.http.patch<ApiResponse<{ id: number }>>(
      baseUrl + `/users/${id}`,
      { user }
    );
  }
}

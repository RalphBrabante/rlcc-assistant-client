import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl } from '../../appConfig';
import { Observable } from 'rxjs';
import { ApiResponse } from './api-response';
import { UserApiResponse } from './user-api-response';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  getAllActiveUsers(query:string): Observable<UserApiResponse> {
    return this.http.get<UserApiResponse>(baseUrl + '/users?name=' + query);
  }
}

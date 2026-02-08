import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { baseUrl } from '../../appConfig';

export interface PcoMigrateUsersResponse {
  status: number;
  message: string;
  data?: {
    count?: number;
  };
}

export interface PcoPreviewUser {
  id: string;
  type: string;
  attributes: {
    first_name?: string;
    last_name?: string;
    name?: string;
    status?: string;
    created_at?: string;
  };
}

export interface PcoPreviewUsersResponse {
  status: number;
  message: string;
  data: {
    users: PcoPreviewUser[];
    count: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class PcoService {
  constructor(private http: HttpClient) {}

  migrateUsersByLastName(lastName: string): Observable<PcoMigrateUsersResponse> {
    return this.http.post<PcoMigrateUsersResponse>(
      `${baseUrl}/pco/migrateUsers`,
      null,
      { params: { lastName } }
    );
  }

  migrateAllUsers(): Observable<PcoMigrateUsersResponse> {
    return this.http.post<PcoMigrateUsersResponse>(
      `${baseUrl}/pco/migrateAllUsers`,
      null
    );
  }

  previewUsersByLastName(
    lastName: string,
    page = 1,
    limit = 50
  ): Observable<PcoPreviewUsersResponse> {
    return this.http.get<PcoPreviewUsersResponse>(`${baseUrl}/pco/previewUsers`, {
      params: { lastName, page, limit },
    });
  }

  previewAllUsers(page = 1, limit = 50): Observable<PcoPreviewUsersResponse> {
    return this.http.get<PcoPreviewUsersResponse>(`${baseUrl}/pco/previewAllUsers`, {
      params: { page, limit },
    });
  }
}

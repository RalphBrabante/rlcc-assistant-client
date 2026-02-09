import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl } from '../../appConfig';
import {
  BulkTithePayload,
  Tithe,
  TitheAPIResp,
} from '../../features/pages/tithes-page/models/tithe';
import { Observable } from 'rxjs';
import { TitheReportApiResponse } from './tithe-type-api-response';
import { ApiResponse } from './api-response';

@Injectable({
  providedIn: 'root',
})
export class TithesService {
  constructor(private http: HttpClient) {}

  /**
   * 
   * @param tithes - array of tithes []
   * @returns - observable
   */
  createBulkTithes(tithes: BulkTithePayload[]) {
    return this.http.post<TitheAPIResp>(baseUrl + `/tithes/bulk-create`, { tithes });
  }

  getAllTithes(params: {
    limit: number;
    page: number;
    name?: string;
    status?: 'all' | 'active' | 'inactive';
    encodedBy?: string;
    createdFrom?: string;
    createdTo?: string;
    dateReceivedFrom?: string;
    dateReceivedTo?: string;
  }): Observable<TitheAPIResp> {
    const query = new URLSearchParams();
    query.set('page', String(params.page));
    query.set('limit', String(params.limit));
    if (params.name) query.set('name', params.name);
    if (params.status) query.set('status', params.status);
    if (params.encodedBy) query.set('encodedBy', params.encodedBy);
    if (params.createdFrom) query.set('createdFrom', params.createdFrom);
    if (params.createdTo) query.set('createdTo', params.createdTo);
    if (params.dateReceivedFrom) query.set('dateReceivedFrom', params.dateReceivedFrom);
    if (params.dateReceivedTo) query.set('dateReceivedTo', params.dateReceivedTo);

    return this.http.get<TitheAPIResp>(baseUrl + `/tithes?${query.toString()}`);
  }

  getUserTithes(params: {
    limit: number;
    page: number;
    name?: string;
    status?: 'all' | 'active' | 'inactive';
    encodedBy?: string;
    createdFrom?: string;
    createdTo?: string;
    dateReceivedFrom?: string;
    dateReceivedTo?: string;
  }): Observable<TitheAPIResp> {
    const query = new URLSearchParams();
    query.set('page', String(params.page));
    query.set('limit', String(params.limit));
    if (params.name) query.set('name', params.name);
    if (params.status) query.set('status', params.status);
    if (params.encodedBy) query.set('encodedBy', params.encodedBy);
    if (params.createdFrom) query.set('createdFrom', params.createdFrom);
    if (params.createdTo) query.set('createdTo', params.createdTo);
    if (params.dateReceivedFrom) query.set('dateReceivedFrom', params.dateReceivedFrom);
    if (params.dateReceivedTo) query.set('dateReceivedTo', params.dateReceivedTo);

    return this.http.get<TitheAPIResp>(baseUrl + `/tithes/user?${query.toString()}`);
  }

  getAllTitheReportByYear(year: string): Observable<TitheReportApiResponse> {
    return this.http.get<TitheReportApiResponse>(
      baseUrl + `/tithes/report?year=${year}`
    );
  }

  getAllTitheReportByUserYear(
    year: string
  ): Observable<TitheReportApiResponse> {
    return this.http.get<TitheReportApiResponse>(
      baseUrl + `/tithes/report/user?year=${year}`
    );
  }

  createTithes(tithe: Tithe): Observable<TitheAPIResp> {
    return this.http.post<TitheAPIResp>(baseUrl + `/tithes`, { tithe });
  }

  getTitheById(id: string): Observable<TitheAPIResp> {
    return this.http.get<TitheAPIResp>(baseUrl + `/tithes/${id}`);
  }

  deleteTithe(titheId: number): Observable<ApiResponse<{ id: number }>> {
    return this.http.patch<ApiResponse<{ id: number }>>(
      baseUrl + `/tithes/${titheId}`,
      null
    );
  }

  updateTithe(
    titheId: string,
    tithe: { tithe: Tithe }
  ): Observable<TitheAPIResp> {
    return this.http.patch<TitheAPIResp>(
      baseUrl + `/tithes/update/${titheId}`,
      tithe
    );
  }
}

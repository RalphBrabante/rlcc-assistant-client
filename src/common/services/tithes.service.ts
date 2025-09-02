import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl } from '../../appConfig';
import {
  Tithe,
  TitheAPIResp,
} from '../../features/pages/tithes-page/models/tithe';
import { Observable } from 'rxjs';
import { TitheReportApiResponse } from './tithe-type-api-response';

@Injectable({
  providedIn: 'root',
})
export class TithesService {
  constructor(private http: HttpClient) {}

  getAllTithes(limit: string, page: string): Observable<TitheAPIResp> {
    return this.http.get<TitheAPIResp>(
      baseUrl + `/tithes?page=${page}&limit=${limit}`
    );
  }

  getUserTithes(limit: string, page: string): Observable<TitheAPIResp> {
    return this.http.get<TitheAPIResp>(
      baseUrl + `/tithes/user?page=${page}&limit=${limit}`
    );
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

  deleteTithe(titheId: number): Observable<{ status: number; id: number }> {
    return this.http.patch<{ status: number; id: number }>(
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

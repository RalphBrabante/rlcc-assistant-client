import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl } from '../../appConfig';
import { Observable } from 'rxjs';
import { TitheTypeApiResponse } from './tithe-type-api-response';
import { TitheType } from '../../features/pages/tithe-type-page/models/tithe-type';
import { ApiResponse } from './api-response';

@Injectable({
  providedIn: 'root',
})
export class TitheTypeService {
  constructor(private http: HttpClient) {}

  getTitheTypeId(id: string): Observable<TitheTypeApiResponse> {
    return this.http.get<TitheTypeApiResponse>(baseUrl + `/titheTypes/${id}`);
  }

  updateTitheType(
    id: string,
    titheType: TitheType
  ): Observable<TitheTypeApiResponse> {
    return this.http.patch<TitheTypeApiResponse>(
      baseUrl + `/titheTypes/${id}`,
      { titheType }
    );
  }

  getAllTitheType(): Observable<TitheTypeApiResponse> {
    return this.http.get<TitheTypeApiResponse>(baseUrl + '/titheTypes');
  }

  createTithe(titheType: TitheType): Observable<TitheTypeApiResponse> {
    return this.http.post<TitheTypeApiResponse>(baseUrl + '/titheTypes', {
      titheType,
    });
  }

  deleteTitheType(id: number): Observable<ApiResponse<{ id: number }>> {
    return this.http.delete<ApiResponse<{ id: number }>>(
      baseUrl + `/titheTypes/${id}`
    );
  }
}

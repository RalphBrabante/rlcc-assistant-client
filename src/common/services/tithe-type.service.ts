import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl } from '../../appConfig';
import { Observable } from 'rxjs';
import { TitheTypeApiResponse } from './tithe-type-api-response';

@Injectable({
  providedIn: 'root'
})
export class TitheTypeService {

  constructor(private http:HttpClient) { }

  getAllTitheType(): Observable<TitheTypeApiResponse>{
    return this.http.get<TitheTypeApiResponse>(baseUrl + '/titheTypes')
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl } from '../../appConfig';
import { TitheAPIResp } from '../../features/pages/tithes-page/models/tithe';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TithesService {
  constructor(private http: HttpClient) {}

  getAllTithes(): Observable<TitheAPIResp> {
    return this.http.get<TitheAPIResp>(baseUrl + '/tithes');
  }

  getUserTithes(): Observable<TitheAPIResp> {
    return this.http.get<TitheAPIResp>(baseUrl + '/tithes/user');
  }
}

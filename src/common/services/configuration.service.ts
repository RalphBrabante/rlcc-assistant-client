import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl } from '../../appConfig';
import { ServerConfiguration } from './server-configuration';
import { Observable } from 'rxjs';
import { ApiResponse } from './api-response';

@Injectable({
  providedIn: 'root',
})
export class ConfigurationService {
  constructor(private http: HttpClient) {}

  getServerConfigurations(): Observable<ApiResponse<{ serverConfigurations: ServerConfiguration[] }>> {
    return this.http.get<ApiResponse<{ serverConfigurations: ServerConfiguration[] }>>(
      baseUrl + '/configurations'
    );
  }
}

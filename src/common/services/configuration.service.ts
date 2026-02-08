import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl } from '../../appConfig';
import { ServerConfiguration } from './server-configuration';
import { Observable } from 'rxjs';
import { ApiResponse } from './api-response';

export interface RuntimeSettings {
  maintenanceMode: boolean;
  devMode: boolean;
}

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

  getPublicRuntimeSettings(): Observable<ApiResponse<RuntimeSettings>> {
    return this.http.get<ApiResponse<RuntimeSettings>>(
      baseUrl + '/configurations/public'
    );
  }

  updateServerConfigurations(
    configurations: Array<{ name: string; value: string }>
  ): Observable<ApiResponse<{ configurations: ServerConfiguration[] }>> {
    return this.http.patch<ApiResponse<{ configurations: ServerConfiguration[] }>>(
      baseUrl + '/configurations',
      { configurations }
    );
  }
}

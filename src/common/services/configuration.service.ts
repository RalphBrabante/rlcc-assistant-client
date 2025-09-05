import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl } from '../../appConfig';
import { ServerConfiguration } from './server-configuration';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConfigurationService {
  constructor(private http: HttpClient) {}

  getServerConfigurations(): Observable<{
    status: number;
    serverConfigurations: ServerConfiguration[];
  }> {
    return this.http.get<{
      status: number;
      serverConfigurations: ServerConfiguration[];
    }>(baseUrl + '/configurations');
  }
}

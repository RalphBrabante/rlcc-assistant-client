import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { baseUrl } from '../../appConfig';

export interface QueueMessage {
  exchange: string;
  routing_key: string;
  redelivered: boolean;
  payload: string;
}

@Injectable({
  providedIn: 'root',
})
export class QueueService {
  constructor(private http: HttpClient) {}

  getQueueMessages(queueName: string): Observable<QueueMessage[]> {
    return this.http.get<QueueMessage[]>(`${baseUrl}/queues/${queueName}`);
  }
}

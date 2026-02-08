import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { baseUrl } from '../../appConfig';
import {
  GroupChatDeleteResponse,
  GroupChatMessagesResponse,
  GroupChatSendResponse,
} from '../../features/pages/circles-page/models/group-chat';

@Injectable({
  providedIn: 'root',
})
export class GroupChatService {
  constructor(private http: HttpClient) {}

  getGroupMessages(
    groupId: number,
    page = 1,
    limit = 50
  ): Observable<GroupChatMessagesResponse> {
    return this.http.get<GroupChatMessagesResponse>(
      `${baseUrl}/groups/${groupId}/chat/messages?page=${page}&limit=${limit}`
    );
  }

  sendGroupMessage(groupId: number, content: string): Observable<GroupChatSendResponse> {
    return this.http.post<GroupChatSendResponse>(
      `${baseUrl}/groups/${groupId}/chat/messages`,
      {
        message: {
          type: 'text',
          content,
        },
      }
    );
  }

  deleteGroupMessage(groupId: number, messageId: number): Observable<GroupChatDeleteResponse> {
    return this.http.delete<GroupChatDeleteResponse>(
      `${baseUrl}/groups/${groupId}/chat/messages/${messageId}`
    );
  }
}

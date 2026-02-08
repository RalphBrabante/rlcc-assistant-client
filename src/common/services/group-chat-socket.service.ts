import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client';
import { socketUrl } from '../../appConfig';
import { GroupChatMessage } from '../../features/pages/circles-page/models/group-chat';

interface NewMessagePayload {
  groupId: number;
  message: GroupChatMessage;
}

interface DeletedMessagePayload {
  groupId: number;
  messageId: number;
}

@Injectable({
  providedIn: 'root',
})
export class GroupChatSocketService {
  private socket: any = null;

  connect() {
    if (this.socket?.connected) return;

    const token = localStorage.getItem('RLCCAT');
    this.socket = io(socketUrl, {
      path: '/socket.io',
      transports: ['websocket'],
      auth: {
        token,
      },
      withCredentials: true,
    });
  }

  disconnect() {
    if (!this.socket) return;
    this.socket.disconnect();
    this.socket = null;
  }

  joinGroup(groupId: number): Promise<void> {
    this.connect();
    return new Promise((resolve, reject) => {
      this.socket?.emit('join-group-chat', { groupId }, (ack: { ok: boolean; message?: string }) => {
        if (ack?.ok) {
          resolve();
          return;
        }
        reject(new Error(ack?.message || 'Unable to join group chat.'));
      });
    });
  }

  leaveGroup(groupId: number) {
    this.socket?.emit('leave-group-chat', { groupId });
  }

  onNewMessage(): Observable<NewMessagePayload> {
    return new Observable((observer) => {
      const handler = (payload: NewMessagePayload) => observer.next(payload);
      this.socket?.on('group-chat:new-message', handler);

      return () => {
        this.socket?.off('group-chat:new-message', handler);
      };
    });
  }

  onMessageDeleted(): Observable<DeletedMessagePayload> {
    return new Observable((observer) => {
      const handler = (payload: DeletedMessagePayload) => observer.next(payload);
      this.socket?.on('group-chat:message-deleted', handler);

      return () => {
        this.socket?.off('group-chat:message-deleted', handler);
      };
    });
  }
}

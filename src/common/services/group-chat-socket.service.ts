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
  private readonly joinedGroups = new Set<number>();

  connect() {
    const token = localStorage.getItem('RLCCAT');

    // Reuse the same socket instance so existing listeners remain attached.
    if (this.socket) {
      this.socket.auth = { token };
      if (!this.socket.connected) {
        this.socket.connect();
      }
      return;
    }

    this.socket = io(
      socketUrl,
      {
        path: '/socket.io',
        transports: ['websocket'],
        auth: {
          token,
        },
        withCredentials: true,
      }
    );

    this.socket.on('connect', () => {
      this.joinedGroups.forEach((groupId) => {
        this.emitJoin(groupId).catch(() => {});
      });
    });
  }

  disconnect() {
    if (!this.socket) return;
    this.socket.disconnect();
    this.socket = null;
  }

  joinGroup(groupId: number): Promise<void> {
    this.connect();
    this.joinedGroups.add(groupId);
    return this.emitJoin(groupId);
  }

  leaveGroup(groupId: number) {
    this.joinedGroups.delete(groupId);
    this.socket?.emit('leave-group-chat', { groupId });
  }

  onNewMessage(): Observable<NewMessagePayload> {
    return new Observable((observer) => {
      this.connect();
      const handler = (payload: NewMessagePayload) => observer.next(payload);
      this.socket?.on('group-chat:new-message', handler);

      return () => {
        this.socket?.off('group-chat:new-message', handler);
      };
    });
  }

  onMessageDeleted(): Observable<DeletedMessagePayload> {
    return new Observable((observer) => {
      this.connect();
      const handler = (payload: DeletedMessagePayload) => observer.next(payload);
      this.socket?.on('group-chat:message-deleted', handler);

      return () => {
        this.socket?.off('group-chat:message-deleted', handler);
      };
    });
  }

  onConnect(): Observable<void> {
    return new Observable((observer) => {
      this.connect();
      const handler = () => observer.next();
      this.socket?.on('connect', handler);

      return () => {
        this.socket?.off('connect', handler);
      };
    });
  }

  onDisconnect(): Observable<void> {
    return new Observable((observer) => {
      this.connect();
      const handler = () => observer.next();
      this.socket?.on('disconnect', handler);

      return () => {
        this.socket?.off('disconnect', handler);
      };
    });
  }

  private emitJoin(groupId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      let settled = false;
      const timeout = setTimeout(() => {
        if (settled) return;
        settled = true;
        reject(new Error('Unable to join group chat room (timeout).'));
      }, 5000);

      this.socket?.emit(
        'join-group-chat',
        { groupId },
        (ack: { ok: boolean; message?: string }) => {
          if (settled) return;
          clearTimeout(timeout);
          settled = true;

          if (ack?.ok) {
            resolve();
            return;
          }

          reject(new Error(ack?.message || 'Unable to join group chat.'));
        }
      );
    });
  }
}

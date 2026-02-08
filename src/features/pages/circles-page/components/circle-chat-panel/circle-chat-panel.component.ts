import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
  signal,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs';
import { BaseComponent } from '../../../../../common/directives/base-component';
import { AuthService } from '../../../../../common/services/auth.service';
import { GroupChatService } from '../../../../../common/services/group-chat.service';
import { GroupChatSocketService } from '../../../../../common/services/group-chat-socket.service';
import { GroupChatMessage } from '../../models/group-chat';

@Component({
  selector: 'app-circle-chat-panel',
  templateUrl: './circle-chat-panel.component.html',
  styleUrl: './circle-chat-panel.component.scss',
})
export class CircleChatPanelComponent extends BaseComponent implements OnChanges, OnDestroy {
  @Input() groupId: number | null = null;
  @Input() canAccess = false;

  @ViewChild('messageList') messageList?: ElementRef<HTMLDivElement>;

  messages = signal<GroupChatMessage[]>([]);
  loading = signal<boolean>(false);
  sending = signal<boolean>(false);
  errorMessage = signal<string>('');
  socketConnected = signal<boolean>(false);
  currentUserId = 0;

  messageControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.maxLength(5000)],
  });

  private activeGroupId: number | null = null;
  private listenersBound = false;

  constructor(
    private groupChatSvc: GroupChatService,
    private groupChatSocketSvc: GroupChatSocketService,
    private authSvc: AuthService
  ) {
    super();
    this.currentUserId = this.safeGetUserId();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['groupId'] || changes['canAccess']) {
      this.initializeChat();
    }
  }

  override ngOnDestroy(): void {
    this.leaveCurrentRoom();
    this.groupChatSocketSvc.disconnect();
    super.ngOnDestroy();
  }

  private initializeChat() {
    this.errorMessage.set('');
    this.messages.set([]);

    if (!this.groupId || !this.canAccess) {
      this.leaveCurrentRoom();
      return;
    }

    if (this.activeGroupId && this.activeGroupId !== this.groupId) {
      this.leaveCurrentRoom();
    }

    this.activeGroupId = this.groupId;
    this.loadMessages(this.groupId);
    this.setupSocket(this.groupId);
  }

  private loadMessages(groupId: number) {
    this.loading.set(true);
    this.groupChatSvc
      .getGroupMessages(groupId, 1, 50)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: (resp) => {
          const rows = resp.data?.messages?.rows || [];
          this.messages.set(
            [...rows].sort(
              (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            )
          );
          this.loading.set(false);
          this.scrollToBottom();
        },
        error: (err) => {
          this.loading.set(false);
          this.errorMessage.set(err?.error?.message || 'Unable to load chat messages.');
        },
      });
  }

  private setupSocket(groupId: number) {
    this.bindSocketListeners();

    this.groupChatSocketSvc
      .joinGroup(groupId)
      .then(() => {
        this.socketConnected.set(true);
      })
      .catch((error) => {
        this.socketConnected.set(false);
        this.errorMessage.set(error?.message || 'Unable to join group chat room.');
      });

  }

  private leaveCurrentRoom() {
    if (!this.activeGroupId) return;
    this.groupChatSocketSvc.leaveGroup(this.activeGroupId);
    this.activeGroupId = null;
    this.socketConnected.set(false);
  }

  sendMessage() {
    const groupId = this.activeGroupId;
    if (!groupId || !this.canAccess) return;

    const messageText = (this.messageControl.value || '').trim();
    if (!messageText) return;

    this.sending.set(true);
    this.errorMessage.set('');
    this.groupChatSvc
      .sendGroupMessage(groupId, messageText)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: (resp) => {
          const message = resp.data?.message;
          if (message) {
            this.upsertMessage(message);
            this.scrollToBottom();
          }
          this.messageControl.setValue('');
          this.sending.set(false);
        },
        error: (err) => {
          this.sending.set(false);
          this.errorMessage.set(err?.error?.message || 'Unable to send message.');
        },
      });
  }

  deleteMessage(messageId: number) {
    if (!this.activeGroupId || !this.canAccess) return;

    this.groupChatSvc
      .deleteGroupMessage(this.activeGroupId, messageId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: () => {
          this.messages.set(this.messages().filter((message) => message.id !== messageId));
        },
        error: (err) => {
          this.errorMessage.set(err?.error?.message || 'Unable to delete message.');
        },
      });
  }

  canDelete(message: GroupChatMessage) {
    return message.senderId === this.currentUserId;
  }

  displaySenderName(message: GroupChatMessage) {
    if (message.sender?.firstName || message.sender?.lastName) {
      return `${message.sender?.firstName || ''} ${message.sender?.lastName || ''}`.trim();
    }

    if (message.senderId === this.currentUserId) {
      return 'You';
    }

    return `User #${message.senderId}`;
  }

  private upsertMessage(message: GroupChatMessage) {
    const current = this.messages();
    const existingIndex = current.findIndex((m) => m.id === message.id);
    if (existingIndex === -1) {
      this.messages.set(
        [...current, message].sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )
      );
      return;
    }

    const updated = [...current];
    updated[existingIndex] = message;
    this.messages.set(updated);
  }

  private scrollToBottom() {
    setTimeout(() => {
      const element = this.messageList?.nativeElement;
      if (!element) return;
      element.scrollTop = element.scrollHeight;
    });
  }

  private bindSocketListeners() {
    if (this.listenersBound) return;
    this.listenersBound = true;

    this.groupChatSocketSvc
      .onNewMessage()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((payload) => {
        if (payload.groupId !== this.activeGroupId) return;
        this.upsertMessage(payload.message);
        this.scrollToBottom();
      });

    this.groupChatSocketSvc
      .onMessageDeleted()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((payload) => {
        if (payload.groupId !== this.activeGroupId) return;
        this.messages.set(this.messages().filter((m) => m.id !== payload.messageId));
      });
  }

  private safeGetUserId() {
    try {
      return this.authSvc.getId();
    } catch (error) {
      return 0;
    }
  }
}

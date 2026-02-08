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
  failedAvatarSenderIds = signal<Set<number>>(new Set());
  currentUserId = 0;

  messageControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.maxLength(5000)],
  });

  private activeGroupId: number | null = null;
  private listenersBound = false;
  private audioContext: AudioContext | null = null;

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
    this.audioContext?.close().catch(() => {});
    this.audioContext = null;
    super.ngOnDestroy();
  }

  private initializeChat() {
    this.errorMessage.set('');
    this.messages.set([]);
    this.failedAvatarSenderIds.set(new Set());

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

  onComposerEnter(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    if (keyboardEvent.shiftKey) return;
    event.preventDefault();
    this.sendMessage();
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

  senderAvatarUrl(message: GroupChatMessage) {
    return message.sender?.avatar?.trim() || '';
  }

  onSenderAvatarError(senderId: number) {
    const failed = new Set(this.failedAvatarSenderIds());
    failed.add(senderId);
    this.failedAvatarSenderIds.set(failed);
  }

  shouldShowSenderAvatar(message: GroupChatMessage) {
    const avatarUrl = this.senderAvatarUrl(message);
    if (!avatarUrl) return false;
    return !this.failedAvatarSenderIds().has(message.senderId);
  }

  senderInitials(message: GroupChatMessage) {
    const first = message.sender?.firstName?.trim()?.charAt(0) || '';
    const last = message.sender?.lastName?.trim()?.charAt(0) || '';
    const initials = `${first}${last}`.toUpperCase();
    if (initials) return initials;
    return 'U';
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
      return true;
    }

    const updated = [...current];
    updated[existingIndex] = message;
    this.messages.set(updated);
    return false;
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
      .onConnect()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => {
        this.socketConnected.set(true);
      });

    this.groupChatSocketSvc
      .onDisconnect()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => {
        this.socketConnected.set(false);
      });

    this.groupChatSocketSvc
      .onNewMessage()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((payload) => {
        if (payload.groupId !== this.activeGroupId) return;
        const isNewMessage = this.upsertMessage(payload.message);
        if (isNewMessage) {
          this.playNewMessageSound();
        }
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

  private playNewMessageSound() {
    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as typeof window & { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioContextClass) return;

      if (!this.audioContext) {
        this.audioContext = new AudioContextClass();
      }

      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume().catch(() => {});
      }

      const now = this.audioContext.currentTime;
      const oscillator = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, now);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.08, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);

      oscillator.connect(gain);
      gain.connect(this.audioContext.destination);

      oscillator.start(now);
      oscillator.stop(now + 0.22);
    } catch (error) {
      // Ignore notification sound errors to avoid impacting chat interactions.
    }
  }
}

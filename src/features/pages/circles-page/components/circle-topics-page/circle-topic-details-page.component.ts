import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { finalize, takeUntil } from 'rxjs';
import { BaseComponent } from '../../../../../common/directives/base-component';
import { AuthService } from '../../../../../common/services/auth.service';
import { GroupService } from '../../../../../common/services/group.service';
import { GroupTopic, GroupTopicComment } from '../../models/group-topic';

@Component({
  selector: 'app-circle-topic-details-page',
  templateUrl: './circle-topic-details-page.component.html',
  styleUrl: './circle-topic-details-page.component.scss',
})
export class CircleTopicDetailsPageComponent extends BaseComponent implements OnInit {
  private readonly COMMENT_PAGE_SIZE = 5;
  private readonly REPLY_PAGE_SIZE = 3;

  topic = signal<GroupTopic | null>(null);
  loading = signal<boolean>(false);
  savingComment = signal<boolean>(false);
  savingReplies = signal<Record<number, boolean>>({});
  errorMessage = signal<string>('');
  commentDraft = signal<string>('');
  replyDrafts = signal<Record<number, string>>({});
  visibleCommentsCount = signal<number>(this.COMMENT_PAGE_SIZE);
  visibleReplies = signal<Record<number, boolean>>({});
  visibleRepliesCount = signal<Record<number, number>>({});
  failedAvatarKeys = signal<Record<string, boolean>>({});

  currentUserId = 0;
  canComment = false;

  constructor(
    private route: ActivatedRoute,
    private groupSvc: GroupService,
    private authSvc: AuthService
  ) {
    super();
    this.currentUserId = this.safeGetUserId();
    this.canComment = this.authSvc.isAdmin() || this.authSvc.isSuperUser();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const topicId = Number(params.get('topicId'));
      if (!topicId) {
        this.errorMessage.set('Invalid topic id.');
        return;
      }
      this.loadTopic(topicId);
    });
  }

  loadTopic(topicId: number) {
    this.loading.set(true);
    this.errorMessage.set('');

    this.groupSvc
      .getAllGroupTopics()
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntil(this.unsubscribe)
      )
      .subscribe({
        next: (resp) => {
          const found = (resp.data.topics || []).find((t) => t.id === topicId) || null;
          this.topic.set(found);
          this.visibleCommentsCount.set(this.COMMENT_PAGE_SIZE);
          this.visibleReplies.set({});
          this.visibleRepliesCount.set({});
          this.replyDrafts.set({});
          this.failedAvatarKeys.set({});
          if (!found) {
            this.errorMessage.set('Topic not found.');
          }
        },
        error: (err) => {
          this.topic.set(null);
          this.errorMessage.set(err?.error?.message || 'Unable to load topic details.');
        },
      });
  }

  visibleComments(): GroupTopicComment[] {
    const comments = this.topic()?.comments || [];
    return comments.slice(0, this.visibleCommentsCount());
  }

  canShowMoreComments(): boolean {
    const comments = this.topic()?.comments || [];
    return comments.length > this.visibleCommentsCount();
  }

  showMoreComments() {
    this.visibleCommentsCount.set(this.visibleCommentsCount() + this.COMMENT_PAGE_SIZE);
  }

  isRepliesVisible(commentId: number): boolean {
    const map = this.visibleReplies();
    if (Object.prototype.hasOwnProperty.call(map, commentId)) return Boolean(map[commentId]);
    return false;
  }

  toggleReplies(commentId: number) {
    this.visibleReplies.update((state) => ({ ...state, [commentId]: !this.isRepliesVisible(commentId) }));
    this.visibleRepliesCount.update((state) => ({
      ...state,
      [commentId]: state[commentId] || this.REPLY_PAGE_SIZE,
    }));
  }

  visibleCommentReplies(comment: GroupTopicComment): GroupTopicComment[] {
    const replies = comment.replies || [];
    const count = this.visibleRepliesCount()[comment.id] || this.REPLY_PAGE_SIZE;
    return replies.slice(0, count);
  }

  canShowMoreReplies(comment: GroupTopicComment): boolean {
    const replies = comment.replies || [];
    const visible = this.visibleRepliesCount()[comment.id] || this.REPLY_PAGE_SIZE;
    return replies.length > visible;
  }

  showMoreReplies(commentId: number) {
    this.visibleRepliesCount.update((state) => ({
      ...state,
      [commentId]: (state[commentId] || this.REPLY_PAGE_SIZE) + this.REPLY_PAGE_SIZE,
    }));
  }

  postComment() {
    if (!this.canComment) return;
    const currentTopic = this.topic();
    if (!currentTopic?.group?.id) return;

    const comment = String(this.commentDraft()).trim();
    if (!comment) {
      this.errorMessage.set('Comment is required.');
      return;
    }

    this.errorMessage.set('');
    this.savingComment.set(true);
    this.groupSvc
      .createGroupTopicComment(currentTopic.group.id, currentTopic.id, { comment })
      .pipe(
        finalize(() => this.savingComment.set(false)),
        takeUntil(this.unsubscribe)
      )
      .subscribe({
        next: (resp) => {
          const created = resp.data.topicComment;
          this.commentDraft.set('');
          this.topic.update((topic) => {
            if (!topic) return topic;
            return {
              ...topic,
              comments: [created, ...(topic.comments || [])],
            };
          });
        },
        error: (err) => {
          this.errorMessage.set(err?.error?.message || 'Unable to add comment.');
        },
      });
  }

  postReply(parentCommentId: number) {
    if (!this.canComment) return;
    const currentTopic = this.topic();
    if (!currentTopic?.group?.id) return;

    const reply = String(this.replyDrafts()[parentCommentId] || '').trim();
    if (!reply) {
      this.errorMessage.set('Reply is required.');
      return;
    }

    this.errorMessage.set('');
    this.savingReplies.update((state) => ({ ...state, [parentCommentId]: true }));

    this.groupSvc
      .createGroupTopicCommentReply(currentTopic.group.id, currentTopic.id, parentCommentId, {
        comment: reply,
      })
      .pipe(
        finalize(() => {
          this.savingReplies.update((state) => ({ ...state, [parentCommentId]: false }));
        }),
        takeUntil(this.unsubscribe)
      )
      .subscribe({
        next: (resp) => {
          const created = resp.data.topicComment;
          this.replyDrafts.update((state) => ({ ...state, [parentCommentId]: '' }));
          this.visibleReplies.update((state) => ({ ...state, [parentCommentId]: true }));
          this.topic.update((topic) => {
            if (!topic) return topic;
            return {
              ...topic,
              comments: (topic.comments || []).map((comment) => {
                if (comment.id !== parentCommentId) return comment;
                return {
                  ...comment,
                  replies: [created, ...(comment.replies || [])],
                };
              }),
            };
          });
        },
        error: (err) => {
          this.errorMessage.set(err?.error?.message || 'Unable to add reply.');
        },
      });
  }

  onReplyInput(commentId: number, value: string) {
    this.replyDrafts.update((state) => ({ ...state, [commentId]: value }));
  }

  formatRelativeTime(value?: string | null): string {
    if (!value) return 'just now';
    const timestamp = new Date(value).getTime();
    if (Number.isNaN(timestamp)) return 'just now';

    const diffSec = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));
    if (diffSec < 60) return 'just now';

    const minutes = Math.floor(diffSec / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);

    const label = (count: number, unit: string) => `${count} ${unit}${count === 1 ? '' : 's'}`;

    if (weeks > 0) {
      const remDays = days % 7;
      return remDays > 0 ? `${label(weeks, 'week')} ${label(remDays, 'day')} ago` : `${label(weeks, 'week')} ago`;
    }

    if (days > 0) {
      const remHours = hours % 24;
      return remHours > 0 ? `${label(days, 'day')} ${label(remHours, 'hour')} ago` : `${label(days, 'day')} ago`;
    }

    if (hours > 0) {
      const remMinutes = minutes % 60;
      return remMinutes > 0 ? `${label(hours, 'hour')} ${label(remMinutes, 'minute')} ago` : `${label(hours, 'hour')} ago`;
    }

    return `${label(minutes, 'minute')} ago`;
  }

  avatarUrl(key: string, avatar?: string | null): string {
    if (this.failedAvatarKeys()[key]) return '';
    return String(avatar || '').trim();
  }

  onAvatarError(key: string) {
    this.failedAvatarKeys.update((state) => ({
      ...state,
      [key]: true,
    }));
  }

  initials(firstName?: string | null, lastName?: string | null): string {
    const first = firstName?.trim()?.charAt(0) || '';
    const last = lastName?.trim()?.charAt(0) || '';
    const value = `${first}${last}`.toUpperCase();
    return value || 'NA';
  }

  private safeGetUserId() {
    try {
      return this.authSvc.getId();
    } catch {
      return 0;
    }
  }
}

import { Component, OnInit, signal, viewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Group } from '../../models/groups';
import { GroupService } from '../../../../../common/services/group.service';
import { BaseComponent } from '../../../../../common/directives/base-component';
import { finalize, takeUntil } from 'rxjs';
import { AssignCirlceMembersModalComponent } from '../assign-cirlce-members-modal/assign-cirlce-members-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteConfirmationModalComponent } from '../../../../../common/components/delete-confirmation-modal/delete-confirmation-modal.component';
import { AuthService } from '../../../../../common/services/auth.service';
import { GroupUser } from '../../models/user';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GroupTopic, GroupTopicComment } from '../../models/group-topic';

@Component({
  selector: 'app-circle-details-page',
  templateUrl: './circle-details-page.component.html',
  styleUrl: './circle-details-page.component.scss',
})
export class CircleDetailsPageComponent
  extends BaseComponent
  implements OnInit
{
  private readonly COMMENT_PAGE_SIZE = 5;
  private readonly REPLY_PAGE_SIZE = 3;
  modal = viewChild<AssignCirlceMembersModalComponent>('modal');
  group = signal<Group | null>(null);
  id = signal<string | null>(null);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string>('');
  topicErrorMessage = signal<string>('');
  topicSuccessMessage = signal<string>('');
  topics = signal<GroupTopic[]>([]);
  topicsLoading = signal<boolean>(false);
  creatingTopic = signal<boolean>(false);
  hasChatAccess = signal<boolean>(false);
  canRemoveMembers = signal<boolean>(false);
  canCreateTopics = signal<boolean>(false);
  canDeleteTopics = signal<boolean>(false);
  canCommentOnTopics = signal<boolean>(false);
  isChatOpen = signal<boolean>(false);
  unreadChatCount = signal<number>(0);
  creatingTopicComments = signal<Record<number, boolean>>({});
  creatingCommentReplies = signal<Record<number, boolean>>({});
  topicCommentDrafts = signal<Record<number, string>>({});
  commentReplyDrafts = signal<Record<number, string>>({});
  expandedReplyForms = signal<Record<number, boolean>>({});
  visibleReplies = signal<Record<number, boolean>>({});
  replyVisibleCount = signal<Record<number, number>>({});
  commentVisibleCount = signal<Record<number, number>>({});
  expandedTopics = signal<Record<number, boolean>>({});
  failedCommentAvatars = signal<Record<number, boolean>>({});
  leaderAvatarFailed = signal<boolean>(false);
  currentUserId = 0;
  topicForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private grpSvc: GroupService,
    private modalService: NgbModal,
    private authSvc: AuthService,
    private fb: FormBuilder
  ) {
    super();
    this.currentUserId = this.safeGetUserId();
    this.canRemoveMembers.set(this.authSvc.isAdmin() || this.authSvc.isSuperUser());
    this.topicForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(120)]],
      description: ['', [Validators.maxLength(2000)]],
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.id.set(params.get('id'));
      this.fetchData();
    });
  }

  fetchData() {
    if (!this.id()) return;

    this.isLoading.set(true);
    this.grpSvc
      .getGroupById(this.id()!)
      .pipe(
        finalize(() => this.isLoading.set(false)),
        takeUntil(this.unsubscribe)
      )
      .subscribe({
        next: (resp) => {
          const group = resp.data.group!;
          this.group.set(group);
          this.hasChatAccess.set(this.checkChatAccess(group));
          this.canCreateTopics.set(
            this.authSvc.isSuperUser() ||
              this.authSvc.isAdmin() ||
              group.leaderId === this.currentUserId
          );
          this.canDeleteTopics.set(
            this.authSvc.isAdmin() ||
              this.authSvc.isSuperUser() ||
              group.leaderId === this.currentUserId
          );
          this.canCommentOnTopics.set(this.checkTopicCommentAccess(group));
          this.leaderAvatarFailed.set(false);
          this.errorMessage.set('');
          this.fetchTopics();
        },
        error: (err) => {
          this.group.set(null);
          this.topics.set([]);
          this.canCreateTopics.set(false);
          this.canDeleteTopics.set(false);
          this.canCommentOnTopics.set(false);
          this.hasChatAccess.set(false);
          this.unreadChatCount.set(0);
          this.leaderAvatarFailed.set(false);
          if (err?.status === 403) {
            this.errorMessage.set(
              err?.error?.message ||
                'You do not have access to view members for this circle.'
            );
            return;
          }
          this.errorMessage.set(
            err?.error?.message || 'Unable to load circle details.'
          );
        },
      });
  }

  fetchTopics(options?: { preserveScrollY?: number }) {
    const groupId = this.id();
    if (!groupId) return;

    this.topicsLoading.set(true);
    this.topicErrorMessage.set('');
    this.grpSvc
      .getGroupTopics(groupId)
      .pipe(
        finalize(() => this.topicsLoading.set(false)),
        takeUntil(this.unsubscribe)
      )
      .subscribe({
        next: (resp) => {
          const nextTopics = resp.data.topics || [];
          const previousExpanded = this.expandedTopics();
          const previousVisibleCounts = this.commentVisibleCount();
          this.topics.set(nextTopics);
          this.topicCommentDrafts.set({});
          this.commentReplyDrafts.set({});
          this.creatingTopicComments.set({});
          this.creatingCommentReplies.set({});
          this.expandedReplyForms.set({});
          this.visibleReplies.set({});
          this.replyVisibleCount.set({});
          this.failedCommentAvatars.set({});
          this.expandedTopics.set(
            nextTopics.reduce((acc, topic) => {
              acc[topic.id] = Boolean(previousExpanded[topic.id]);
              return acc;
            }, {} as Record<number, boolean>)
          );
          this.commentVisibleCount.set(
            nextTopics.reduce((acc, topic) => {
              acc[topic.id] =
                previousVisibleCounts[topic.id] || this.COMMENT_PAGE_SIZE;
              return acc;
            }, {} as Record<number, number>)
          );

          if (typeof options?.preserveScrollY === 'number') {
            const top = options.preserveScrollY;
            setTimeout(() => {
              window.scrollTo({ top, behavior: 'auto' });
            }, 0);
          }
        },
        error: (err) => {
          this.topics.set([]);
          this.topicErrorMessage.set(
            err?.error?.message || 'Unable to load topics for this circle.'
          );
        },
      });
  }

  get topicTitle() {
    return this.topicForm.get('title') as FormControl;
  }

  get topicDescription() {
    return this.topicForm.get('description') as FormControl;
  }

  onCreateTopic() {
    if (!this.canCreateTopics()) return;
    if (this.topicForm.invalid) {
      this.topicForm.markAllAsTouched();
      return;
    }

    const groupId = this.id();
    if (!groupId) return;

    this.creatingTopic.set(true);
    this.topicErrorMessage.set('');
    this.topicSuccessMessage.set('');

    this.grpSvc
      .createGroupTopic(groupId, {
        title: String(this.topicTitle.value || '').trim(),
        description: String(this.topicDescription.value || '').trim() || null,
      })
      .pipe(
        finalize(() => this.creatingTopic.set(false)),
        takeUntil(this.unsubscribe)
      )
      .subscribe({
        next: () => {
          this.topicForm.reset();
          this.topicSuccessMessage.set('Topic created successfully.');
          this.fetchTopics();
        },
        error: (err) => {
          this.topicErrorMessage.set(
            err?.error?.message || 'Unable to create topic.'
          );
        },
      });
  }

  onDeleteTopic(topicId: number) {
    if (!this.canDeleteTopics()) return;

    const groupId = this.id();
    if (!groupId) return;

    this.topicErrorMessage.set('');
    this.topicSuccessMessage.set('');

    this.grpSvc
      .deleteGroupTopic(groupId, topicId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: () => {
          this.topicSuccessMessage.set('Topic deleted successfully.');
          this.fetchTopics();
        },
        error: (err) => {
          this.topicErrorMessage.set(
            err?.error?.message || 'Unable to delete topic.'
          );
        },
      });
  }

  open() {
    if (!this.canRemoveMembers()) return;
    this.modal()?.openCreateCircleModal(this.group()!);
  }

  private checkChatAccess(group: Group) {
    const members = group.groupMembers || [];
    if (group.userId === this.currentUserId || group.leaderId === this.currentUserId) {
      return true;
    }
    return members.some((member) => member.id === this.currentUserId);
  }

  private checkTopicCommentAccess(group: Group): boolean {
    if (this.authSvc.isAdmin() || this.authSvc.isSuperUser()) {
      return true;
    }
    const members = group.groupMembers || [];
    return members.some((member) => member.id === this.currentUserId);
  }

  private safeGetUserId() {
    try {
      return this.authSvc.getId();
    } catch (error) {
      return 0;
    }
  }

  onRemoveMember(userId: number) {
    if (!this.canRemoveMembers()) return;
    if (userId === this.currentUserId) {
      this.errorMessage.set('You cannot remove yourself from this circle.');
      return;
    }

    const selectedGroup = this.group();
    if (!selectedGroup?.id) return;

    const modalRef = this.modalService.open(DeleteConfirmationModalComponent, {
      centered: true,
      backdrop: 'static',
    });

    modalRef.componentInstance.title = 'Remove Member';
    modalRef.componentInstance.message =
      'Are you sure you want to unassign this user from this circle?';

    modalRef.result.then(
      (confirmed) => {
        if (!confirmed) return;

        this.grpSvc
          .removeUserFromGroup(selectedGroup.id!, userId)
          .pipe(takeUntil(this.unsubscribe))
          .subscribe({
            next: () => {
              this.fetchData();
            },
            error: (err) => {
              this.errorMessage.set(
                err?.error?.message || 'Unable to remove member from circle.'
              );
            },
          });
      },
      () => {}
    );
  }

  leaderProfile(): GroupUser | null {
    const group = this.group();
    if (!group?.leaderId) return null;

    const members = group.groupMembers || [];
    return members.find((member) => member.id === group.leaderId) || null;
  }

  leaderName(): string {
    const leader = this.leaderProfile();
    if (leader) {
      return `${leader.firstName} ${leader.lastName}`.trim();
    }
    return 'No leader assigned';
  }

  leaderAvatarUrl(): string {
    const leader = this.leaderProfile();
    return leader?.avatar?.trim() || '';
  }

  onLeaderAvatarError() {
    this.leaderAvatarFailed.set(true);
  }

  leaderInitials(): string {
    const leader = this.leaderProfile();
    if (!leader) return 'NA';
    const first = leader.firstName?.trim()?.charAt(0) || '';
    const last = leader.lastName?.trim()?.charAt(0) || '';
    const initials = `${first}${last}`.toUpperCase();
    return initials || 'NA';
  }

  canRemoveSpecificMember(memberId: number): boolean {
    return this.canRemoveMembers() && memberId !== this.currentUserId;
  }

  getTopicCommentDraft(topicId: number): string {
    return this.topicCommentDrafts()[topicId] || '';
  }

  onTopicCommentInput(topicId: number, value: string) {
    this.topicCommentDrafts.update((drafts) => ({
      ...drafts,
      [topicId]: value,
    }));
  }

  onCreateTopicComment(topicId: number) {
    if (!this.canCommentOnTopics()) return;

    const groupId = this.id();
    if (!groupId) return;

    const comment = String(this.getTopicCommentDraft(topicId)).trim();
    if (!comment) {
      this.topicErrorMessage.set('Comment is required.');
      return;
    }

    if (comment.length > 1000) {
      this.topicErrorMessage.set('Comment must be 1000 characters or fewer.');
      return;
    }

    this.topicErrorMessage.set('');
    this.topicSuccessMessage.set('');
    this.creatingTopicComments.update((state) => ({
      ...state,
      [topicId]: true,
    }));

    this.grpSvc
      .createGroupTopicComment(groupId, topicId, { comment })
      .pipe(
        finalize(() => {
          this.creatingTopicComments.update((state) => ({
            ...state,
            [topicId]: false,
          }));
        }),
        takeUntil(this.unsubscribe)
      )
      .subscribe({
        next: (resp) => {
          const newComment = resp?.data?.topicComment;
          if (!newComment) return;

          this.topicCommentDrafts.update((drafts) => ({
            ...drafts,
            [topicId]: '',
          }));

          this.topics.update((currentTopics) =>
            currentTopics.map((topic) => {
              if (topic.id !== topicId) return topic;
              return {
                ...topic,
                comments: [newComment, ...(topic.comments || [])],
              };
            })
          );
        },
        error: (err) => {
          this.topicErrorMessage.set(
            err?.error?.message || 'Unable to add comment.'
          );
        },
      });
  }

  commentAvatarUrl(topic: GroupTopic, commentId: number): string {
    if (this.failedCommentAvatars()[commentId]) return '';
    const comment = this.findCommentById(topic, commentId);
    return comment?.creator?.avatar?.trim() || '';
  }

  private findCommentById(topic: GroupTopic, commentId: number): GroupTopicComment | null {
    for (const comment of topic.comments || []) {
      if (comment.id === commentId) return comment;
      for (const reply of comment.replies || []) {
        if (reply.id === commentId) return reply;
      }
    }
    return null;
  }

  onCommentAvatarError(commentId: number) {
    this.failedCommentAvatars.update((state) => ({
      ...state,
      [commentId]: true,
    }));
  }

  commentInitials(firstName?: string | null, lastName?: string | null): string {
    const first = firstName?.trim()?.charAt(0) || '';
    const last = lastName?.trim()?.charAt(0) || '';
    const initials = `${first}${last}`.toUpperCase();
    return initials || 'NA';
  }

  visibleComments(topic: GroupTopic) {
    const allComments = topic.comments || [];
    const count = this.commentVisibleCount()[topic.id] || this.COMMENT_PAGE_SIZE;
    return allComments.slice(0, count);
  }

  canShowMoreComments(topic: GroupTopic): boolean {
    const allComments = topic.comments || [];
    const visible = this.commentVisibleCount()[topic.id] || this.COMMENT_PAGE_SIZE;
    return allComments.length > visible;
  }

  showMoreComments(topicId: number) {
    this.commentVisibleCount.update((state) => ({
      ...state,
      [topicId]: (state[topicId] || this.COMMENT_PAGE_SIZE) + this.COMMENT_PAGE_SIZE,
    }));
  }

  isReplyFormExpanded(commentId: number): boolean {
    return Boolean(this.expandedReplyForms()[commentId]);
  }

  toggleReplyForm(commentId: number) {
    this.expandedReplyForms.update((state) => ({
      ...state,
      [commentId]: !state[commentId],
    }));
  }

  getReplyDraft(commentId: number): string {
    return this.commentReplyDrafts()[commentId] || '';
  }

  onReplyInput(commentId: number, value: string) {
    this.commentReplyDrafts.update((drafts) => ({
      ...drafts,
      [commentId]: value,
    }));
  }

  onCreateCommentReply(topicId: number, parentCommentId: number) {
    if (!this.canCommentOnTopics()) return;

    const groupId = this.id();
    if (!groupId) return;

    const comment = String(this.getReplyDraft(parentCommentId)).trim();
    if (!comment) {
      this.topicErrorMessage.set('Reply is required.');
      return;
    }

    if (comment.length > 1000) {
      this.topicErrorMessage.set('Reply must be 1000 characters or fewer.');
      return;
    }

    this.topicErrorMessage.set('');
    this.creatingCommentReplies.update((state) => ({
      ...state,
      [parentCommentId]: true,
    }));

    this.grpSvc
      .createGroupTopicCommentReply(groupId, topicId, parentCommentId, { comment })
      .pipe(
        finalize(() => {
          this.creatingCommentReplies.update((state) => ({
            ...state,
            [parentCommentId]: false,
          }));
        }),
        takeUntil(this.unsubscribe)
      )
      .subscribe({
        next: (resp) => {
          const newReply = resp?.data?.topicComment;
          if (!newReply) return;

          this.commentReplyDrafts.update((drafts) => ({
            ...drafts,
            [parentCommentId]: '',
          }));
          this.expandedReplyForms.update((state) => ({
            ...state,
            [parentCommentId]: false,
          }));
          this.visibleReplies.update((state) => ({
            ...state,
            [parentCommentId]: true,
          }));
          this.replyVisibleCount.update((state) => ({
            ...state,
            [parentCommentId]: this.REPLY_PAGE_SIZE,
          }));

          this.topics.update((currentTopics) =>
            currentTopics.map((topic) => {
              if (topic.id !== topicId) return topic;
              return {
                ...topic,
                comments: (topic.comments || []).map((item) => {
                  if (item.id !== parentCommentId) return item;
                  return {
                    ...item,
                    replies: [newReply, ...(item.replies || [])],
                  };
                }),
              };
            })
          );
        },
        error: (err) => {
          this.topicErrorMessage.set(
            err?.error?.message || 'Unable to add reply.'
          );
        },
      });
  }

  canDeleteOwnComment(comment: GroupTopicComment): boolean {
    return Number(comment.createdBy) === Number(this.currentUserId);
  }

  canDeleteTopLevelComment(comment: GroupTopicComment): boolean {
    return this.canDeleteOwnComment(comment) && (comment.replies || []).length === 0;
  }

  isRepliesVisible(commentId: number): boolean {
    const visibleMap = this.visibleReplies();
    if (Object.prototype.hasOwnProperty.call(visibleMap, commentId)) {
      return Boolean(visibleMap[commentId]);
    }
    return false;
  }

  toggleRepliesVisible(commentId: number) {
    this.visibleReplies.update((state) => ({
      ...state,
      [commentId]: !this.isRepliesVisible(commentId),
    }));
    this.replyVisibleCount.update((state) => ({
      ...state,
      [commentId]: state[commentId] || this.REPLY_PAGE_SIZE,
    }));
  }

  visibleCommentReplies(comment: GroupTopicComment): GroupTopicComment[] {
    const replies = comment.replies || [];
    const count = this.replyVisibleCount()[comment.id] || this.REPLY_PAGE_SIZE;
    return replies.slice(0, count);
  }

  canShowMoreReplies(comment: GroupTopicComment): boolean {
    const replies = comment.replies || [];
    const visible = this.replyVisibleCount()[comment.id] || this.REPLY_PAGE_SIZE;
    return replies.length > visible;
  }

  showMoreReplies(commentId: number) {
    this.replyVisibleCount.update((state) => ({
      ...state,
      [commentId]: (state[commentId] || this.REPLY_PAGE_SIZE) + this.REPLY_PAGE_SIZE,
    }));
  }

  onDeleteTopicComment(topicId: number, commentId: number) {
    const groupId = this.id();
    if (!groupId) return;

    this.topicErrorMessage.set('');

    this.grpSvc
      .deleteGroupTopicComment(groupId, topicId, commentId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: () => {
          this.topics.update((currentTopics) =>
            currentTopics.map((topic) => {
              if (topic.id !== topicId) return topic;
              return {
                ...topic,
                comments: (topic.comments || [])
                  .filter((comment) => comment.id !== commentId)
                  .map((comment) => ({
                    ...comment,
                    replies: (comment.replies || []).filter((reply) => reply.id !== commentId),
                  })),
              };
            })
          );
        },
        error: (err) => {
          this.topicErrorMessage.set(
            err?.error?.message || 'Unable to delete comment.'
          );
        },
      });
  }

  formatRelativeTime(value?: string | null): string {
    if (!value) return 'just now';
    const timestamp = new Date(value).getTime();
    if (Number.isNaN(timestamp)) return 'just now';

    const diffMs = Date.now() - timestamp;
    const diffSec = Math.max(0, Math.floor(diffMs / 1000));

    if (diffSec < 60) return 'just now';

    const minutes = Math.floor(diffSec / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);

    const label = (count: number, unit: string) =>
      `${count} ${unit}${count === 1 ? '' : 's'}`;

    if (weeks > 0) {
      const remDays = days % 7;
      return remDays > 0
        ? `${label(weeks, 'week')} ${label(remDays, 'day')} ago`
        : `${label(weeks, 'week')} ago`;
    }

    if (days > 0) {
      const remHours = hours % 24;
      return remHours > 0
        ? `${label(days, 'day')} ${label(remHours, 'hour')} ago`
        : `${label(days, 'day')} ago`;
    }

    if (hours > 0) {
      const remMinutes = minutes % 60;
      return remMinutes > 0
        ? `${label(hours, 'hour')} ${label(remMinutes, 'minute')} ago`
        : `${label(hours, 'hour')} ago`;
    }

    return `${label(minutes, 'minute')} ago`;
  }

  topicDescriptionExcerpt(topic: GroupTopic): string {
    const description = String(topic.description || '').trim();
    if (!description) return 'No description.';
    if (description.length <= 140) return description;
    return `${description.slice(0, 140)}...`;
  }

  isTopicExpanded(topicId: number): boolean {
    return Boolean(this.expandedTopics()[topicId]);
  }

  toggleTopicExpanded(topicId: number) {
    this.expandedTopics.update((state) => ({
      ...state,
      [topicId]: !state[topicId],
    }));
  }

  toggleChatPanel() {
    const nextState = !this.isChatOpen();
    this.isChatOpen.set(nextState);
    if (nextState) {
      this.unreadChatCount.set(0);
    }
  }

  onChatUnreadCountChange(count: number) {
    this.unreadChatCount.set(Math.max(0, Number(count || 0)));
  }
}

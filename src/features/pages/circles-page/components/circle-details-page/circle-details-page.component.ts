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
import { GroupTopic } from '../../models/group-topic';

@Component({
  selector: 'app-circle-details-page',
  templateUrl: './circle-details-page.component.html',
  styleUrl: './circle-details-page.component.scss',
})
export class CircleDetailsPageComponent
  extends BaseComponent
  implements OnInit
{
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
          this.leaderAvatarFailed.set(false);
          this.errorMessage.set('');
          this.fetchTopics();
        },
        error: (err) => {
          this.group.set(null);
          this.topics.set([]);
          this.canCreateTopics.set(false);
          this.canDeleteTopics.set(false);
          this.hasChatAccess.set(false);
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

  fetchTopics() {
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
          this.topics.set(resp.data.topics || []);
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
}

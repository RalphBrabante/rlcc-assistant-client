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
  hasChatAccess = signal<boolean>(false);
  canRemoveMembers = signal<boolean>(false);
  leaderAvatarFailed = signal<boolean>(false);
  currentUserId = 0;

  constructor(
    private route: ActivatedRoute,
    private grpSvc: GroupService,
    private modalService: NgbModal,
    private authSvc: AuthService
  ) {
    super();
    this.currentUserId = this.safeGetUserId();
    this.canRemoveMembers.set(this.authSvc.isAdmin() || this.authSvc.isSuperUser());
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
          this.leaderAvatarFailed.set(false);
          this.errorMessage.set('');
        },
        error: (err) => {
          this.group.set(null);
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

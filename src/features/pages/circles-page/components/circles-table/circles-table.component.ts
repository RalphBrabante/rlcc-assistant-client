import { Component, OnInit, signal, viewChild } from '@angular/core';
import { BaseComponent } from '../../../../../common/directives/base-component';
import { GroupService } from '../../../../../common/services/group.service';
import { finalize, takeUntil } from 'rxjs';
import { Group } from '../../models/groups';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateCircleModalComponent } from '../create-circle-modal/create-circle-modal.component';
import { DeleteConfirmationModalComponent } from '../../../../../common/components/delete-confirmation-modal/delete-confirmation-modal.component';
import { AuthService } from '../../../../../common/services/auth.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PaginationComponent } from '../../../../../common/components/pagination/pagination.component';

@Component({
  selector: 'app-circles-table',
  templateUrl: './circles-table.component.html',
  styleUrl: './circles-table.component.scss',
})
export class CirclesTableComponent extends BaseComponent implements OnInit {
  modal = viewChild<CreateCircleModalComponent>('modal');
  pagination = viewChild<PaginationComponent>('pagination');
  groupsData = signal<Group[]>([]);
  dataCount = signal<number>(0);
  errorMessage = signal<string>('');
  filterError = signal<string>('');
  isLoading = signal<boolean>(false);
  canManageCircles = signal<boolean>(false);
  canRequestJoin = signal<boolean>(false);
  joiningGroupState = signal<Record<number, boolean>>({});
  filtersForm: FormGroup;
  private errorTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private grpSvc: GroupService,
    private modalService: NgbModal,
    private authSvc: AuthService,
    private fb: FormBuilder
  ) {
    super();
    this.canManageCircles.set(this.authSvc.isAdmin() || this.authSvc.isSuperUser());
    const roles = this.authSvc.getRoles();
    this.canRequestJoin.set(
      roles.includes('ENDUSER') && !this.authSvc.isAdmin() && !this.authSvc.isSuperUser()
    );
    this.filtersForm = this.fb.group({
      name: [''],
      status: ['active'],
      encodedBy: [''],
      createdFrom: [''],
      createdTo: [''],
    });
  }

  canJoinGroup(group: Group): boolean {
    if (!this.canRequestJoin()) return false;
    if (!group?.id || !group.isActive) return false;
    if (group.isMember) return false;
    if (group.hasPendingJoinRequest) return false;
    return true;
  }

  membershipLabel(group: Group): string {
    if (group?.isMember) return 'Joined';
    if (group?.hasPendingJoinRequest) return 'Pending';
    return 'Not a member';
  }

  membershipBadgeClass(group: Group): string {
    if (group?.isMember) return 'bg-success-subtle text-success-emphasis';
    if (group?.hasPendingJoinRequest) return 'bg-warning-subtle text-warning-emphasis';
    return 'bg-secondary-subtle text-secondary-emphasis';
  }

  onRequestJoin(group: Group) {
    if (!group?.id || !this.canJoinGroup(group)) return;

    const modalRef = this.modalService.open(DeleteConfirmationModalComponent, {
      centered: true,
      backdrop: 'static',
    });

    modalRef.componentInstance.title = 'Request to Join Circle';
    modalRef.componentInstance.message = `Send a join request to ${group.name}?`;
    modalRef.componentInstance.confirmLabel = 'Send Request';
    modalRef.componentInstance.confirmButtonClass = 'btn btn-primary';

    modalRef.result.then(
      (confirmed) => {
        if (!confirmed) return;

        this.joiningGroupState.update((state) => ({
          ...state,
          [group.id!]: true,
        }));

        this.grpSvc
          .requestToJoinGroup(group.id!)
          .pipe(takeUntil(this.unsubscribe))
          .subscribe({
            next: () => {
              this.joiningGroupState.update((state) => ({
                ...state,
                [group.id!]: false,
              }));
              this.fetchData();
            },
            error: (err) => {
              this.joiningGroupState.update((state) => ({
                ...state,
                [group.id!]: false,
              }));
              this.setErrorMessage(
                err?.error?.message || 'Unable to send join request.',
                3000
              );
            },
          });
      },
      () => {}
    );
  }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    const createdFrom = String(this.filtersForm.value.createdFrom || '').trim();
    const createdTo = String(this.filtersForm.value.createdTo || '').trim();
    if (createdFrom && createdTo && new Date(createdFrom) > new Date(createdTo)) {
      this.filterError.set('Created From must be on or before Created To.');
      return;
    }

    this.filterError.set('');
    this.isLoading.set(true);
    this.grpSvc
      .getAllGroupsAndCount({
        page: this.pagination()?.currentPage() || 1,
        limit: this.pagination()?.pageSize || 10,
        name: String(this.filtersForm.value.name || '').trim() || undefined,
        status: this.filtersForm.value.status || 'active',
        encodedBy: String(this.filtersForm.value.encodedBy || '').trim() || undefined,
        createdFrom: createdFrom || undefined,
        createdTo: createdTo || undefined,
      })
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
        }),
        takeUntil(this.unsubscribe)
      )
      .subscribe({
        next: (resp) => {
          this.groupsData.set(resp.data?.groups?.rows ?? []);
          this.dataCount.set(resp.data?.groups?.count ?? 0);
          this.errorMessage.set('');
        },
        error: (err) => {
          this.groupsData.set([]);
          this.setErrorMessage(err?.error?.message || 'Unable to load circles.', 3000);
        },
      });
  }

  applyFilters() {
    this.pagination()?.currentPage.set(1);
    this.fetchData();
  }

  resetFilters() {
    this.filtersForm.reset({
      name: '',
      status: 'active',
      encodedBy: '',
      createdFrom: '',
      createdTo: '',
    });
    this.pagination()?.currentPage.set(1);
    this.filterError.set('');
    this.fetchData();
  }

  open() {
    if (!this.canManageCircles()) return;
    this.modal()?.openCreateCircleModal();
  }

  setErrorMessage(message: string, ms: number) {
    this.errorMessage.set(message);
    if (this.errorTimer) clearTimeout(this.errorTimer);
    this.errorTimer = setTimeout(() => {
      this.errorMessage.set('');
      this.errorTimer = null;
    }, ms);
  }
  onDeleteGroup(groupId: number) {
    const modalRef = this.modalService.open(DeleteConfirmationModalComponent, {
      centered: true,
      backdrop: 'static',
    });

    modalRef.componentInstance.title = 'Delete Group';
    modalRef.componentInstance.message =
      'Are you sure you want to delete this group? Please take note that all members will get detached.';

    modalRef.result.then(
      (result) => {
        if (result) {
          this.grpSvc
            .deleteGroup(groupId)
            .pipe(takeUntil(this.unsubscribe))
            .subscribe({
              next: (resp) => {
                if (resp.data.id) {
                  modalRef.close();
                  this.fetchData();
                }
              },
              error: (err) => {
                this.setErrorMessage(err?.error?.message || 'Unable to delete circle.', 2500);
              },
            });
        }
      },
      () => {}
    );
  }
}

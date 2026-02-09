import { Component, OnInit, output, signal, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { GroupService } from '../../../../../common/services/group.service';
import {
  debounceTime,
  distinctUntilChanged,
  finalize,
  of,
  switchMap,
  takeUntil,
} from 'rxjs';
import { BaseComponent } from '../../../../../common/directives/base-component';
import { UserService } from '../../../../../common/services/user.service';
import { GroupUser } from '../../models/user';
import { Group } from '../../models/groups';

@Component({
  selector: 'app-create-circle-modal',
  templateUrl: './create-circle-modal.component.html',
  styleUrl: './create-circle-modal.component.scss',
})
export class CreateCircleModalComponent
  extends BaseComponent
  implements OnInit
{
  @ViewChild('createCircleModal') createCircleModal: any;
  circleForm!: FormGroup;
  isSaving = signal<boolean>(false);
  isSearchingUsers = signal<boolean>(false);
  errorMessage = signal<string>('');
  lookupUsers = signal<GroupUser[]>([]);
  selectedLeader = signal<GroupUser | null>(null);
  showLookupDropdown = signal<boolean>(false);
  groupTypes = signal<Array<{ id: number; name: string }>>([]);

  fetchData = output<boolean>();

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private groupSvc: GroupService,
    private userSvc: UserService
  ) {
    super();
    this.circleForm = this.fb.group({
      name: ['', Validators.required],
      groupTypeId: [null, Validators.required],
      leaderLookup: [''],
    });
  }

  ngOnInit(): void {
    this.loadGroupTypes();
    this.leaderLookup.valueChanges
      .pipe(
        debounceTime(350),
        distinctUntilChanged(),
        switchMap((value: string) => {
          const keyword = (value || '').trim();
          const currentLeader = this.selectedLeader();
          if (currentLeader) {
            const selectedLeaderLabel =
              `${currentLeader.firstName} ${currentLeader.lastName}`.trim();
            if (keyword !== selectedLeaderLabel) {
              this.selectedLeader.set(null);
            }
          }

          if (!keyword.length) {
            this.lookupUsers.set([]);
            this.showLookupDropdown.set(false);
            return of(null);
          }

          this.isSearchingUsers.set(true);
          this.errorMessage.set('');
          return this.userSvc.getAllActiveUsers(keyword).pipe(
            finalize(() => this.isSearchingUsers.set(false))
          );
        }),
        takeUntil(this.unsubscribe)
      )
      .subscribe({
        next: (resp) => {
          if (!resp) return;

          const selectedLeaderId = this.selectedLeader()?.id;
          const users = (resp.data?.rows || []).filter(
            (user: GroupUser) => user.id !== selectedLeaderId
          );

          this.lookupUsers.set(users);
          this.showLookupDropdown.set(users.length > 0);
        },
        error: (err) => {
          this.lookupUsers.set([]);
          this.showLookupDropdown.set(false);
          this.errorMessage.set(err?.error?.message || 'Unable to search users.');
        },
      });
  }

  get name() {
    return this.circleForm.get('name') as FormControl;
  }

  get leaderLookup() {
    return this.circleForm.get('leaderLookup') as FormControl;
  }

  get groupTypeId() {
    return this.circleForm.get('groupTypeId') as FormControl;
  }

  openCreateCircleModal() {
    this.loadGroupTypes();
    this.errorMessage.set('');
    this.selectedLeader.set(null);
    this.lookupUsers.set([]);
    this.showLookupDropdown.set(false);
    this.circleForm.reset();
    this.circleForm.patchValue({ groupTypeId: null });
    this.modalService.open(this.createCircleModal, {
      centered: true,
      size: 'lg',
    });
  }

  selectLeader(user: GroupUser) {
    this.selectedLeader.set(user);
    this.leaderLookup.setValue(`${user.firstName} ${user.lastName}`, {
      emitEvent: false,
    });
    this.lookupUsers.set([]);
    this.showLookupDropdown.set(false);
  }

  clearSelectedLeader() {
    this.selectedLeader.set(null);
    this.leaderLookup.setValue('', { emitEvent: false });
    this.lookupUsers.set([]);
    this.showLookupDropdown.set(false);
  }

  hideLookupDropdown() {
    setTimeout(() => this.showLookupDropdown.set(false), 150);
  }

  saveGroup(modal: any) {
    if (this.circleForm.invalid) {
      this.circleForm.markAllAsTouched(); // show errors on submit
      return;
    }

    const groupPayload: Group = {
      name: (this.name.value || '').trim(),
      groupTypeId: Number(this.groupTypeId.value),
      isActive: true,
    };

    this.isSaving.set(true);
    this.errorMessage.set('');

    this.groupSvc
      .createGroup(groupPayload)
      .pipe(
        switchMap((resp) => {
          const groupId = resp.data?.group?.id;
          const leaderId = this.selectedLeader()?.id;

          if (!groupId || !leaderId) {
            return of(resp);
          }

          return this.groupSvc
            .assignUsersToGroup([{ groupId, userId: leaderId }])
            .pipe(
              switchMap(() =>
                this.groupSvc.assignGroupAdministrator(groupId, leaderId)
              ),
              switchMap(() => of(resp))
            );
        }),
        finalize(() => {
          this.isSaving.set(false);
          this.fetchData.emit(true); // reload table
        }),
        takeUntil(this.unsubscribe)
      )
      .subscribe({
        next: () => {
          modal.close();
          this.circleForm.reset();
          this.selectedLeader.set(null);
          this.lookupUsers.set([]);
          this.showLookupDropdown.set(false);
        },
        error: (err) => {
          this.errorMessage.set(
            err?.error?.message || 'Unable to create circle right now.'
          );
        },
      });
  }

  private loadGroupTypes() {
    this.groupSvc
      .getAllGroupTypes()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: (resp) => {
          this.groupTypes.set(resp.data?.groupTypes || []);
        },
        error: (err) => {
          this.groupTypes.set([]);
        },
      });
  }
}

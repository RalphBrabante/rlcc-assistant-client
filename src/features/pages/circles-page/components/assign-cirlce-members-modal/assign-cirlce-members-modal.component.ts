import {
  Component,
  input,
  model,
  OnInit,
  output,
  signal,
  ViewChild,
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { GroupService } from '../../../../../common/services/group.service';
import { finalize, takeUntil } from 'rxjs';
import { BaseComponent } from '../../../../../common/directives/base-component';
import { Group, GroupUsers } from '../../models/groups';

@Component({
  selector: 'app-assign-cirlce-members-modal',
  templateUrl: './assign-cirlce-members-modal.component.html',
  styleUrl: './assign-cirlce-members-modal.component.scss',
})
export class AssignCirlceMembersModalComponent extends BaseComponent {
  @ViewChild('assignCirclceMembersModal') assignCirclceMembersModal: any;
  circleForm!: FormGroup;
  isSaving = signal<boolean>(false);
  group = signal<Group | null>(null);
  errorMessage = signal<string>('');
  fetchData = output<boolean>();
  groupId = input<number>();
  userAndGroupIds = signal<GroupUsers[]>([]);

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private groupSvc: GroupService
  ) {
    super();
    this.circleForm = this.fb.group({
      name: [''],
    });
  }

  ngOnInit(): void {}

  get name() {
    return this.circleForm.get('name') as FormControl;
  }

  openCreateCircleModal(payload: Group) {
    this.group.set(payload);
    this.errorMessage.set('');
    this.userAndGroupIds.set([]);
    this.modalService.open(this.assignCirclceMembersModal, {
      centered: true,
      size: 'lg',
      scrollable: true,
    });
  }

  closeModal(modal: any) {
    this.userAndGroupIds.set([]);
    this.errorMessage.set('');
    modal.dismiss();
  }
  setDataset(data: any[]) {
    this.userAndGroupIds.set(data);
  }
  saveGroup(modal: any) {
    if (!this.userAndGroupIds().length) {
      this.errorMessage.set('Please select at least one member.');
      return;
    }

    if (this.circleForm.invalid) {
      this.circleForm.markAllAsTouched(); // show errors on submit
      return;
    }
    if (this.circleForm.valid) {
      this.isSaving.set(true);
      this.errorMessage.set('');
      this.groupSvc
        .assignUsersToGroup(this.userAndGroupIds())
        .pipe(
          finalize(() => {
            this.isSaving.set(false);
            this.fetchData.emit(true);
          }),
          takeUntil(this.unsubscribe)
        )
        .subscribe({
          next: () => {
            modal.dismiss();
          },
          error: (err) => {
            this.errorMessage.set(
              err?.error?.message || 'Unable to assign members right now.'
            );
          },
        });
    }
  }
}

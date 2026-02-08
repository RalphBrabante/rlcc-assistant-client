import {
  Component,
  EventEmitter,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { BaseComponent } from '../../../../../common/directives/base-component';
import { GroupService } from '../../../../../common/services/group.service';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  debounceTime,
  finalize,
  of,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { GroupUser } from '../../models/user';

@Component({
  selector: 'app-circle-member-search-field',
  templateUrl: './circle-member-search-field.component.html',
  styleUrl: './circle-member-search-field.component.scss',
})
export class CircleMemberSearchFieldComponent
  extends BaseComponent
  implements OnInit
{
  form!: FormGroup;
  unassignedUsers = signal<GroupUser[]>([]);
  loading = signal<boolean>(false);
  errorMessage = signal<string>('');
  groupId = input<number>();
  emitIdDataSet = output<any[]>();
  constructor(private fb: FormBuilder, private grpSvc: GroupService) {
    super();

    this.form = this.fb.group({
      searchKeyword: [''],
      membersToBeAdded: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.searchKeyword.valueChanges
      .pipe(
        debounceTime(350),
        tap(() => {
          this.errorMessage.set('');
          this.unassignedUsers.set([]);
        }),
        switchMap((searchKeyword: string) => {
          const keyword = (searchKeyword || '').trim();
          if (!keyword.length) {
            return of(null);
          }

          this.loading.set(true);
          return this.grpSvc.getUnassignedUsers(keyword).pipe(
            finalize(() => this.loading.set(false))
          );
        }),
        takeUntil(this.unsubscribe)
      )
      .subscribe({
        next: (resp) => {
          if (!resp) {
            this.errorMessage.set('');
            return;
          }

          const rows = resp.data.rows;
          const excludeIds = this.membersToBeAdded.value.map((m: any) => m.userId);
          const filtered = rows.filter((row) => !excludeIds.includes(row.id));

          if (!filtered.length) {
            this.errorMessage.set('No unassigned users found for this search.');
          }

          this.unassignedUsers.set(filtered);
        },
        error: (err) => {
          this.loading.set(false);
          this.errorMessage.set(
            err?.error?.message || 'Unable to fetch unassigned users.'
          );
        },
      });
  }

  addMemberToArray(user: GroupUser) {
    const exists = this.membersToBeAdded.value.some((m: any) => m.userId === user.id);
    if (exists) return;

    this.membersToBeAdded.push(
      this.fb.group({
        userId: user.id,
        fullName: user.firstName + ' ' + user.lastName,
        groupId: this.groupId(),
      })
    );

    //clear result

    this.unassignedUsers.set([]);
    this.searchKeyword.setValue('');
    this.emitIdDataSet.emit(this.membersToBeAdded.value);
  }

  removeToBeAddedMember(id: number) {
    const index = this.membersToBeAdded.controls.findIndex(
      (m) => m.value.userId == id
    );

    if (index !== -1) {
      this.membersToBeAdded.removeAt(index);
    }

    this.emitIdDataSet.emit(this.membersToBeAdded.value);
  }

  clearSelectedMembers() {
    while (this.membersToBeAdded.length) {
      this.membersToBeAdded.removeAt(0);
    }
    this.emitIdDataSet.emit(this.membersToBeAdded.value);
  }

  get searchKeyword() {
    return this.form.get('searchKeyword') as FormControl;
  }

  get membersToBeAdded(): FormArray {
    return this.form.get('membersToBeAdded') as FormArray;
  }

  get hasSearchKeyword() {
    return !!(this.searchKeyword.value || '').trim().length;
  }
}

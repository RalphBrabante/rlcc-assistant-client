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
  filter,
  finalize,
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
        debounceTime(1000),
        filter((val: string) => val.length >= 3),
        tap(() => {
          this.loading.set(true);
          this.searchKeyword.disable({ emitEvent: false });
          this.errorMessage.set('');
        }),
        switchMap((searchKeyword) => {
          return this.grpSvc.getUnassignedUsers(searchKeyword);
        }),

        takeUntil(this.unsubscribe)
      )
      .subscribe({
        next: (resp) => {
          const rows = resp.data.rows;
          const excludeIds = this.membersToBeAdded.value.map((m: any) => m.id);
          const filtered = rows.filter((row) => !excludeIds.includes(row.id));

          if (!filtered.length) {
            this.errorMessage.set('Unassigned users not found.');
          }

          this.unassignedUsers.set(filtered);
          this.loading.set(false);
          this.searchKeyword.enable({ emitEvent: false });
        },
        error: (err) => {
          this.errorMessage.set(err.error.message);
        },
      });
  }

  addMemberToArray(user: GroupUser) {
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

  get searchKeyword() {
    return this.form.get('searchKeyword') as FormControl;
  }

  get membersToBeAdded(): FormArray {
    return this.form.get('membersToBeAdded') as FormArray;
  }
}

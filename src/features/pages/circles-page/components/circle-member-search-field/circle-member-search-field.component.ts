import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../../../../common/directives/base-component';
import { GroupService } from '../../../../../common/services/group.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { debounceTime, switchMap, takeUntil } from 'rxjs';

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
  constructor(private fb: FormBuilder, private grpSvc: GroupService) {
    super();

    this.form = this.fb.group({
      searchKeyword: [''],
    });
  }

  ngOnInit(): void {
    this.searchKeyword.valueChanges
      .pipe(
        debounceTime(1000),
        takeUntil(this.unsubscribe),
        switchMap((searchKeyword) => {
          return this.grpSvc.getUnassignedUsers(searchKeyword);
        })
      )
      .subscribe({
        next: (val) => {
          console.log(val);
        },
      });
  }

  get searchKeyword() {
    return this.form.get('searchKeyword') as FormControl;
  }
}

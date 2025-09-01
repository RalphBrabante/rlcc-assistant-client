import { Component, OnInit, output, signal } from '@angular/core';
import { BaseComponent } from '../../directives/base-component';
import { UserService } from '../../services/user.service';
import { debounceTime, takeUntil } from 'rxjs';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-active-members-lookup-dropdown',
  templateUrl: './active-members-lookup-dropdown.component.html',
  styleUrl: './active-members-lookup-dropdown.component.scss',
})
export class ActiveMembersLookupDropdownComponent
  extends BaseComponent
  implements OnInit
{
  results: any[] = [];
  showDropdown = false;
  allUsers = signal<any[]>([]);
  form!: FormGroup;
  emitMemberName = output<string>();

  emitMemberId = output<string>();

  constructor(private usrSvc: UserService, private fb: FormBuilder) {
    super();

    this.form = this.fb.group({
      searchWord: [null, Validators.required],
    });
  }

  get searchWord() {
    return this.form.get('searchWord') as FormControl;
  }

  ngOnInit(): void {
    this.searchWord.valueChanges
      .pipe(debounceTime(1000), takeUntil(this.unsubscribe))
      .subscribe({
        next: (val) => {
          if (val && val.length) {
            this.onSearch();
          }
        },
      });
  }

  onSearch() {
    this.showDropdown = false;
    this.usrSvc
      .getAllActiveUsers(this.searchWord.value)
      .pipe(debounceTime(2000), takeUntil(this.unsubscribe))
      .subscribe({
        next: (resp) => {
          this.results = resp.data.rows;
          this.showDropdown = true;
        },
      });
  }

  selectItem(user: any) {
    this.results = [];
    this.showDropdown = false;
    this.emitMemberName.emit(user.firstName + ' ' + user.lastName);
    this.emitMemberId.emit(user.id);


  }

  hideDropdown() {
    // Delay hiding to allow click to register
    setTimeout(() => (this.showDropdown = false), 200);
  }
}

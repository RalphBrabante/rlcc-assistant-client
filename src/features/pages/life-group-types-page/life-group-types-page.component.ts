import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { finalize, takeUntil } from 'rxjs';
import { BaseComponent } from '../../../common/directives/base-component';
import { GroupService } from '../../../common/services/group.service';

@Component({
  selector: 'app-life-group-types-page',
  templateUrl: './life-group-types-page.component.html',
  styleUrl: './life-group-types-page.component.scss'
})
export class LifeGroupTypesPageComponent extends BaseComponent implements OnInit {
  form: FormGroup;
  groupTypes = signal<Array<{ id: number; name: string }>>([]);
  loading = signal<boolean>(false);
  saving = signal<boolean>(false);
  errorMessage = signal<string>('');

  constructor(private fb: FormBuilder, private groupSvc: GroupService) {
    super();
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(120)]],
    });
  }

  ngOnInit(): void {
    this.fetchGroupTypes();
  }

  get name() {
    return this.form.get('name') as FormControl;
  }

  fetchGroupTypes() {
    this.loading.set(true);
    this.errorMessage.set('');

    this.groupSvc
      .getAllGroupTypes()
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntil(this.unsubscribe)
      )
      .subscribe({
        next: (resp: any) => {
          this.groupTypes.set(resp.data?.groupTypes || []);
        },
        error: (err: any) => {
          this.groupTypes.set([]);
          this.errorMessage.set(err?.error?.message || 'Unable to load circle types.');
        },
      });
  }

  createType() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const name = String(this.name.value || '').trim();
    if (!name) {
      this.errorMessage.set('Group type name is required.');
      return;
    }

    this.saving.set(true);
    this.errorMessage.set('');
    this.groupSvc
      .createGroupType(name)
      .pipe(
        finalize(() => this.saving.set(false)),
        takeUntil(this.unsubscribe)
      )
      .subscribe({
        next: () => {
          this.form.reset();
          this.fetchGroupTypes();
        },
        error: (err: any) => {
          this.errorMessage.set(err?.error?.message || 'Unable to create circle type.');
        },
      });
  }

  deleteType(id: number) {
    const confirmed = window.confirm('Delete this circle type?');
    if (!confirmed) return;

    this.errorMessage.set('');
    this.groupSvc
      .deleteGroupType(id)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: () => {
          this.groupTypes.set(this.groupTypes().filter((type) => type.id !== id));
        },
        error: (err: any) => {
          this.errorMessage.set(err?.error?.message || 'Unable to delete circle type.');
        },
      });
  }

}

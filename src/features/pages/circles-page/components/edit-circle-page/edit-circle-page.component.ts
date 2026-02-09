import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { finalize, takeUntil } from 'rxjs';
import { BaseComponent } from '../../../../../common/directives/base-component';
import { GroupService } from '../../../../../common/services/group.service';

@Component({
  selector: 'app-edit-circle-page',
  templateUrl: './edit-circle-page.component.html',
  styleUrl: './edit-circle-page.component.scss',
})
export class EditCirclePageComponent extends BaseComponent implements OnInit {
  circleId = signal<number | null>(null);
  loading = signal<boolean>(false);
  saving = signal<boolean>(false);
  errorMessage = signal<string>('');
  successMessage = signal<string>('');
  groupTypes = signal<Array<{ id: number; name: string }>>([]);

  form: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private groupSvc: GroupService
  ) {
    super();
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(120)]],
      groupTypeId: [null, Validators.required],
      isActive: [true],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      if (!Number.isInteger(id) || id < 1) {
        this.errorMessage.set('Invalid circle id.');
        return;
      }

      this.circleId.set(id);
      this.loadGroupTypes();
      this.loadCircle(id);
    });
  }

  get name() {
    return this.form.get('name') as FormControl;
  }

  get groupTypeId() {
    return this.form.get('groupTypeId') as FormControl;
  }

  loadGroupTypes() {
    this.groupSvc
      .getAllGroupTypes()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: (resp) => {
          this.groupTypes.set(resp.data?.groupTypes || []);
        },
        error: () => {
          this.groupTypes.set([]);
        },
      });
  }

  loadCircle(id: number) {
    this.loading.set(true);
    this.errorMessage.set('');

    this.groupSvc
      .getGroupById(String(id))
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntil(this.unsubscribe)
      )
      .subscribe({
        next: (resp) => {
          const group = resp.data?.group;
          if (!group) {
            this.errorMessage.set('Group not found.');
            return;
          }

          this.form.patchValue({
            name: group.name || '',
            groupTypeId: group.groupType?.id || group.groupTypeId || null,
            isActive: Boolean(group.isActive),
          });
        },
        error: (err) => {
          this.errorMessage.set(err?.error?.message || 'Unable to load circle details.');
        },
      });
  }

  save() {
    const id = this.circleId();
    if (!id) return;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.groupSvc
      .updateGroup(id, {
        name: String(this.name.value || '').trim(),
        groupTypeId: Number(this.groupTypeId.value),
        isActive: Boolean(this.form.value.isActive),
      })
      .pipe(
        finalize(() => this.saving.set(false)),
        takeUntil(this.unsubscribe)
      )
      .subscribe({
        next: () => {
          this.successMessage.set('Group updated successfully.');
        },
        error: (err) => {
          this.errorMessage.set(err?.error?.message || 'Unable to update circle.');
        },
      });
  }

  goBack() {
    this.router.navigate(['/circles']);
  }
}

import { Component, signal } from '@angular/core';
import { BaseComponent } from '../../../common/directives/base-component';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { finalize, takeUntil } from 'rxjs';
import {
  PcoPreviewUser,
  PcoService,
} from '../../../common/services/pco.service';

@Component({
  selector: 'app-pco-users-migration-page',
  templateUrl: './pco-users-migration-page.component.html',
  styleUrl: './pco-users-migration-page.component.scss',
})
export class PcoUsersMigrationPageComponent extends BaseComponent {
  readonly previewLimit = 50;
  form: FormGroup;
  isProcessing = signal<boolean>(false);
  isProcessingAll = signal<boolean>(false);
  isPreviewing = signal<boolean>(false);
  previewUsers = signal<PcoPreviewUser[]>([]);
  previewCount = signal<number>(0);
  previewScope = signal<'none' | 'lastName' | 'all'>('none');
  previewPage = signal<number>(1);
  previewTotalPages = signal<number>(1);
  successMessage = signal<string>('');
  errorMessage = signal<string>('');

  constructor(private fb: FormBuilder, private pcoSvc: PcoService) {
    super();
    this.form = this.fb.group({
      lastName: ['', [Validators.required, Validators.minLength(2)]],
    });
  }

  get lastName() {
    return this.form.get('lastName') as FormControl;
  }

  previewUsersByLastName(page = 1) {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const lastName = (this.lastName.value || '').trim();
    if (!lastName) {
      this.lastName.setErrors({ required: true });
      return;
    }

    this.isPreviewing.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');
    this.previewUsers.set([]);
    this.previewCount.set(0);
    this.previewScope.set('none');
    this.previewPage.set(1);
    this.previewTotalPages.set(1);

    this.pcoSvc
      .previewUsersByLastName(lastName, page, this.previewLimit)
      .pipe(
        finalize(() => this.isPreviewing.set(false)),
        takeUntil(this.unsubscribe)
      )
      .subscribe({
        next: (resp) => {
          this.previewUsers.set(resp?.data?.users || []);
          this.previewCount.set(resp?.data?.count || 0);
          this.previewScope.set('lastName');
          this.previewPage.set(resp?.data?.page || page);
          this.previewTotalPages.set(resp?.data?.totalPages || 1);
        },
        error: (err) => {
          this.errorMessage.set(
            err?.error?.message || 'Unable to preview users from Planning Center.'
          );
        },
      });
  }

  previewAllUsers(page = 1) {
    this.isPreviewing.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');
    this.previewUsers.set([]);
    this.previewCount.set(0);
    this.previewScope.set('none');
    this.previewPage.set(1);
    this.previewTotalPages.set(1);

    this.pcoSvc
      .previewAllUsers(page, this.previewLimit)
      .pipe(
        finalize(() => this.isPreviewing.set(false)),
        takeUntil(this.unsubscribe)
      )
      .subscribe({
        next: (resp) => {
          this.previewUsers.set(resp?.data?.users || []);
          this.previewCount.set(resp?.data?.count || 0);
          this.previewScope.set('all');
          this.previewPage.set(resp?.data?.page || page);
          this.previewTotalPages.set(resp?.data?.totalPages || 1);
        },
        error: (err) => {
          this.errorMessage.set(
            err?.error?.message || 'Unable to preview all users from Planning Center.'
          );
        },
      });
  }

  previewNextPage() {
    if (this.previewPage() >= this.previewTotalPages()) return;
    const targetPage = this.previewPage() + 1;
    if (this.previewScope() === 'all') {
      this.previewAllUsers(targetPage);
      return;
    }
    if (this.previewScope() === 'lastName') {
      this.previewUsersByLastName(targetPage);
    }
  }

  previewPreviousPage() {
    if (this.previewPage() <= 1) return;
    const targetPage = this.previewPage() - 1;
    if (this.previewScope() === 'all') {
      this.previewAllUsers(targetPage);
      return;
    }
    if (this.previewScope() === 'lastName') {
      this.previewUsersByLastName(targetPage);
    }
  }

  processUsers() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const lastName = (this.lastName.value || '').trim();
    if (!lastName) {
      this.lastName.setErrors({ required: true });
      return;
    }

    this.isProcessing.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.pcoSvc
      .migrateUsersByLastName(lastName)
      .pipe(
        finalize(() => this.isProcessing.set(false)),
        takeUntil(this.unsubscribe)
      )
      .subscribe({
        next: (resp) => {
          const count = resp?.data?.count ?? this.previewCount();
          this.successMessage.set(
            resp.message || `${count} user(s) for last name "${lastName}" were queued successfully.`
          );
        },
        error: (err) => {
          this.errorMessage.set(
            err?.error?.message || 'Unable to process users from Planning Center.'
          );
        },
      });
  }

  processAllUsers() {
    if (this.previewScope() !== 'all') {
      this.errorMessage.set('Please preview ALL members first before processing all.');
      return;
    }

    const confirmed = window.confirm(
      'Queue all Planning Center members for migration? This may enqueue a large number of records.'
    );
    if (!confirmed) return;

    this.isProcessingAll.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.pcoSvc
      .migrateAllUsers()
      .pipe(
        finalize(() => this.isProcessingAll.set(false)),
        takeUntil(this.unsubscribe)
      )
      .subscribe({
        next: (resp) => {
          const count = resp?.data?.count ?? 0;
          this.successMessage.set(
            resp.message || `${count} PCO member(s) were queued successfully.`
          );
        },
        error: (err) => {
          this.errorMessage.set(
            err?.error?.message || 'Unable to process all users from Planning Center.'
          );
        },
      });
  }
}

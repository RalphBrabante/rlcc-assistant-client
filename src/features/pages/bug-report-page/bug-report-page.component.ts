import { Component, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs';
import { BaseComponent } from '../../../common/directives/base-component';
import {
  BugReportPayload,
  BugReportScope,
  BugReportService,
  BugReportSeverity,
} from '../../../common/services/bug-report.service';

@Component({
  selector: 'app-bug-report-page',
  templateUrl: './bug-report-page.component.html',
  styleUrl: './bug-report-page.component.scss',
})
export class BugReportPageComponent extends BaseComponent {
  reportForm: FormGroup;
  submitAttempted = signal<boolean>(false);
  submitting = signal<boolean>(false);
  submitSuccess = signal<string>('');
  submitError = signal<string>('');

  readonly scopeOptions: Array<{ value: BugReportScope; label: string }> = [
    { value: 'client', label: 'Client Side (UI / browser)' },
    { value: 'server', label: 'Server Side (API / backend)' },
  ];

  readonly severityOptions: Array<{ value: BugReportSeverity; label: string }> = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' },
  ];

  constructor(private fb: FormBuilder, private bugReportService: BugReportService) {
    super();

    this.reportForm = this.fb.group({
      title: [null, [Validators.required, Validators.maxLength(160)]],
      scope: ['client', [Validators.required]],
      severity: ['medium', [Validators.required]],
      pageUrl: [window.location.href, [Validators.maxLength(500)]],
      description: [null, [Validators.required, Validators.maxLength(5000)]],
    });
  }

  get title() {
    return this.reportForm.get('title') as FormControl;
  }

  get scope() {
    return this.reportForm.get('scope') as FormControl;
  }

  get severity() {
    return this.reportForm.get('severity') as FormControl;
  }

  get pageUrl() {
    return this.reportForm.get('pageUrl') as FormControl;
  }

  get description() {
    return this.reportForm.get('description') as FormControl;
  }

  showFieldError(controlName: string): boolean {
    const control = this.reportForm.get(controlName);
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || this.submitAttempted())
    );
  }

  private normalizeNullableField(value: string | null | undefined): string | null {
    const trimmed = String(value || '').trim();
    return trimmed || null;
  }

  private buildPayload(): BugReportPayload {
    return {
      title: String(this.title.value || '').trim(),
      description: String(this.description.value || '').trim(),
      scope: this.scope.value,
      severity: this.severity.value,
      pageUrl: this.normalizeNullableField(this.pageUrl.value),
    };
  }

  onSubmit() {
    this.submitAttempted.set(true);
    this.submitError.set('');
    this.submitSuccess.set('');

    if (this.reportForm.invalid) {
      this.reportForm.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.reportForm.disable();

    this.bugReportService
      .createBugReport(this.buildPayload())
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: () => {
          this.submitSuccess.set('Bug report submitted. Thank you for reporting this issue.');
          this.submitAttempted.set(false);
          this.submitting.set(false);
          this.reportForm.reset({
            title: null,
            scope: 'client',
            severity: 'medium',
            pageUrl: window.location.href,
            description: null,
          });
          this.reportForm.markAsPristine();
          this.reportForm.markAsUntouched();
          this.reportForm.enable();
        },
        error: (error) => {
          this.submitError.set(error?.error?.message || 'Unable to submit bug report.');
          this.submitting.set(false);
          this.reportForm.enable();
        },
      });
  }
}

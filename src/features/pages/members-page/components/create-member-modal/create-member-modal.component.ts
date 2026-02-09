import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize, takeUntil } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BaseComponent } from '../../../../../common/directives/base-component';
import { UserService } from '../../../../../common/services/user.service';

@Component({
  selector: 'app-create-member-modal',
  templateUrl: './create-member-modal.component.html',
  styleUrl: './create-member-modal.component.scss',
})
export class CreateMemberModalComponent extends BaseComponent {
  @Output() userCreated = new EventEmitter<void>();

  form: FormGroup;
  isSaving = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private userSvc: UserService,
    public activeModal: NgbActiveModal
  ) {
    super();
    this.form = this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(120)]],
      lastName: ['', [Validators.required, Validators.maxLength(120)]],
      emailAddress: ['', [Validators.required, Validators.email, Validators.maxLength(160)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(100)]],
      pcoId: [''],
      isActive: [true],
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const pcoRaw = String(this.form.value.pcoId || '').trim();
    const parsedPcoId = pcoRaw ? Number.parseInt(pcoRaw, 10) : null;
    if (pcoRaw && (parsedPcoId === null || !Number.isInteger(parsedPcoId) || parsedPcoId < 1)) {
      this.errorMessage = 'PCOID must be a positive number.';
      return;
    }

    this.errorMessage = '';
    this.isSaving = true;

    this.userSvc
      .createUser({
        firstName: String(this.form.value.firstName || '').trim(),
        lastName: String(this.form.value.lastName || '').trim(),
        emailAddress: String(this.form.value.emailAddress || '').trim(),
        password: String(this.form.value.password || ''),
        pcoId: parsedPcoId,
        isActive: Boolean(this.form.value.isActive),
      })
      .pipe(
        finalize(() => {
          this.isSaving = false;
        }),
        takeUntil(this.unsubscribe)
      )
      .subscribe({
        next: () => {
          this.userCreated.emit();
          this.activeModal.close(true);
        },
        error: (error) => {
          this.errorMessage = error?.error?.message || 'Unable to create user.';
        },
      });
  }
}

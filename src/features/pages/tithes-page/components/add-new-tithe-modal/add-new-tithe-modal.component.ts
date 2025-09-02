import { Component, OnInit, output, signal, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { formatToTwoDecimals } from '../../../../../utils/decimalFormatter';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { TithesService } from '../../../../../common/services/tithes.service';
import { finalize, takeUntil } from 'rxjs';
import { BaseComponent } from '../../../../../common/directives/base-component';

@Component({
  selector: 'app-add-new-tithe-modal',
  templateUrl: './add-new-tithe-modal.component.html',
  styleUrl: './add-new-tithe-modal.component.scss',
})
export class AddNewTitheModalComponent extends BaseComponent implements OnInit {
  @ViewChild('addTitheModal') addTitheModal: any;
  titheForm!: FormGroup;
  isSaving = signal<boolean>(false);
  formatToTwoDecimals = formatToTwoDecimals;
  fetchData = output<boolean>();

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private titheSvc: TithesService
  ) {
    super();
    const today = new Date().toISOString().split('T')[0];
    this.titheForm = this.fb.group({
      dateReceived: [today, Validators.required],
      amount: ['', [Validators.required, Validators.min(1)]],
      memberId: [null, Validators.required],
      memberName: ['', Validators.required],
      titheTypeId: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  get amount() {
    return this.titheForm.get('amount') as FormControl;
  }

  get memberId() {
    return this.titheForm.get('memberId') as FormControl;
  }

  get dateReceived() {
    return this.titheForm.get('dateReceived') as FormControl;
  }

  get memberName() {
    return this.titheForm.get('memberName') as FormControl;
  }

  get titheTypeId() {
    return this.titheForm.get('titheTypeId') as FormControl;
  }

  setTitheType(id: string) {
    this.titheTypeId.setValue(id);
  }

  removeMemberNameAndId() {
    this.memberId.reset();
    this.memberName.reset();
  }
  openAddTitheModal() {
    this.modalService.open(this.addTitheModal, { centered: true, size: 'md' });
  }

  onMemberSelect($event: string) {
    this.memberName.setValue($event);
    this.memberName.disable();
  }

  onMemberSelectId($event: string) {
    this.memberId.setValue($event);
  }

  saveTithe(modal: any) {
    console.log('saving');

    if (this.titheForm.invalid) {
      console.log('invalid');
      this.titheForm.markAllAsTouched(); // show errors on submit
      return;
    }
    if (this.titheForm.valid) {
      const newTithe = this.titheForm.value;
      console.log('Saving tithe:', newTithe);

      this.titheSvc
        .createTithes(this.titheForm.value)
        .pipe(
          finalize(() => {
            this.fetchData.emit(true); // reload table
          }),
          takeUntil(this.unsubscribe)
        )
        .subscribe({
          next: (resp) => {
            modal.close();
            this.titheForm.reset();
          },
        });

      // TODO: Call your backend service to save
    }
  }
}

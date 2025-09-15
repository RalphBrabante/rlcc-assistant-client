import { Component, OnInit, output, signal, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { GroupService } from '../../../../../common/services/group.service';
import { finalize, takeUntil } from 'rxjs';
import { BaseComponent } from '../../../../../common/directives/base-component';
import { Group } from '../../models/groups';

@Component({
  selector: 'app-create-circle-modal',
  templateUrl: './create-circle-modal.component.html',
  styleUrl: './create-circle-modal.component.scss',
})
export class CreateCircleModalComponent
  extends BaseComponent
  implements OnInit
{
  @ViewChild('createCircleModal') createCircleModal: any;
  circleForm!: FormGroup;
  isSaving = signal<boolean>(false);

  fetchData = output<boolean>();

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private groupSvc: GroupService
  ) {
    super();
    this.circleForm = this.fb.group({
      name: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  get name() {
    return this.circleForm.get('name') as FormControl;
  }

  openCreateCircleModal() {
    this.modalService.open(this.createCircleModal, {
      centered: true,
      size: 'md',
    });
  }

  saveGroup(modal: any) {
    console.log('saving');

    if (this.circleForm.invalid) {
      console.log('invalid');
      this.circleForm.markAllAsTouched(); // show errors on submit
      return;
    }
    if (this.circleForm.valid) {
      const newTithe = this.circleForm.value;
      console.log('Saving circle:', newTithe);

      this.groupSvc
        .createGroup(this.circleForm.value)
        .pipe(
          finalize(() => {
            this.fetchData.emit(true); // reload table
          }),
          takeUntil(this.unsubscribe)
        )
        .subscribe({
          next: (resp) => {
            modal.close();
            this.circleForm.reset();
          },
        });
    }
  }
}

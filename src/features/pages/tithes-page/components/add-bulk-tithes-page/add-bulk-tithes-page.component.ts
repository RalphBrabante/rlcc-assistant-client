import { Component, signal } from '@angular/core';
import { BaseComponent } from '../../../../../common/directives/base-component';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { formatToTwoDecimals } from '../../../../../utils/decimalFormatter';
import { TithesService } from '../../../../../common/services/tithes.service';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-add-bulk-tithes-page',
  templateUrl: './add-bulk-tithes-page.component.html',
  styleUrl: './add-bulk-tithes-page.component.scss',
})
export class AddBulkTithesPageComponent extends BaseComponent {
  tithesArray = signal<any[]>([]);
  formatToTwoDecimals = formatToTwoDecimals;
  form!: FormGroup;
  isSuccess = signal<boolean>(false);

  constructor(private fb: FormBuilder, private titheSvc: TithesService) {
    super();

    this.form = this.fb.group({
      index: [0],
      memberId: [null, [Validators.required]],
      titheTypeId: [null, [Validators.required]],
      titheTypeName: [null],
      dateReceived: [null, [Validators.required]],
      amount: [null, [Validators.required]],
      fullName: [null],
    });
  }

  get index() {
    return this.form.get('index') as FormControl;
  }
  get memberId() {
    return this.form.get('memberId') as FormControl;
  }

  get titheTypeId() {
    return this.form.get('titheTypeId') as FormControl;
  }

  get titheTypeName() {
    return this.form.get('titheTypeName') as FormControl;
  }

  get dateReceived() {
    return this.form.get('dateReceived') as FormControl;
  }

  get amount() {
    return this.form.get('amount') as FormControl;
  }

  get fullName() {
    return this.form.get('fullName') as FormControl;
  }

  removeTithe(index: string) {
    this.tithesArray.set(this.tithesArray().filter((t) => t.index !== index));
  }

  setMemberId($event: any) {
    this.memberId.setValue($event);
  }

  setFullName($event: any) {
    this.fullName.setValue($event);
  }
  setTitheTypeId($event: any) {
    this.titheTypeId.setValue($event);
  }

  setTitheTypeName($event: any) {
    this.titheTypeName.setValue($event);
  }

  clearMemberIdAndName() {
    this.fullName.reset();
    this.memberId.reset();
  }
  addToList() {
    this.index.setValue(this.index.value + 1);
    if (this.form.valid) {
      this.tithesArray.update((prevValue) => [this.form.value, ...prevValue]);
    }
  }

  processTithes() {
    this.isSuccess.set(false);
    this.titheSvc
      .createBulkTithes(this.tithesArray())
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: (resp) => {
          this.isSuccess.set(true);
          this.tithesArray.set([]);
          this.form.reset();
        },
      });
  }
}

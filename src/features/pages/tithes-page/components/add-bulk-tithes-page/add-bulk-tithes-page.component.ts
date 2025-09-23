import { Component, signal } from '@angular/core';
import { BaseComponent } from '../../../../../common/directives/base-component';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { formatToTwoDecimals } from '../../../../../utils/decimalFormatter';

@Component({
  selector: 'app-add-bulk-tithes-page',
  templateUrl: './add-bulk-tithes-page.component.html',
  styleUrl: './add-bulk-tithes-page.component.scss',
})
export class AddBulkTithesPageComponent extends BaseComponent {
  tithesArray = signal<any[]>([]);
  formatToTwoDecimals = formatToTwoDecimals;
  form!: FormGroup;

  constructor(private fb: FormBuilder) {
    super();

    this.form = this.fb.group({
      userId: [null, [Validators.required]],
      titheTypeId: [null, [Validators.required]],
      titheTypeName: [null],
      amount: [null, [Validators.required]],
      fullName: [null],
    });
  }

  get userId() {
    return this.form.get('userId') as FormControl;
  }

  get titheTypeId() {
    return this.form.get('titheTypeId') as FormControl;
  }

  get titheTypeName() {
    return this.form.get('titheTypeName') as FormControl;
  }

  get amount() {
    return this.form.get('amount') as FormControl;
  }

  get fullName() {
    return this.form.get('fullName') as FormControl;
  }

  setUserId($event: any) {
    this.userId.setValue($event);
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
    this.userId.reset();
  }
  addToList() {
    if (this.form.valid) {
      this.tithesArray.update((prevValue) => [this.form.value, ...prevValue]);
    }
  }
}

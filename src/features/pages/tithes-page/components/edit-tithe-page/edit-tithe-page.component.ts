import {
  Component,
  OnInit,
  output,
  signal,
  ViewChild,
} from '@angular/core';
import { BaseComponent } from '../../../../../common/directives/base-component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { TithesService } from '../../../../../common/services/tithes.service';
import { formatToTwoDecimals } from '../../../../../utils/decimalFormatter';
import { finalize, takeUntil } from 'rxjs';

import { ActivatedRoute, Router } from '@angular/router';
import { ActiveTitheTypeDropdownComponent } from '../../../../../common/components/active-tithe-type-dropdown/active-tithe-type-dropdown.component';

@Component({
  selector: 'app-edit-tithe-page',
  templateUrl: './edit-tithe-page.component.html',
  styleUrl: './edit-tithe-page.component.scss',
})
export class EditTithePageComponent extends BaseComponent implements OnInit {
  titheForm!: FormGroup;
  isLoading = signal<boolean>(false);
  isSaving = signal<boolean>(false);
  formatToTwoDecimals = formatToTwoDecimals;
  fetchData = output<boolean>();
  id!: string;
  selectedTypeId = signal<string>('');

  @ViewChild('titheTypeDropdown')
  titheTypeDropdown!: ActiveTitheTypeDropdownComponent;

  constructor(
    private fb: FormBuilder,
    private titheSvc: TithesService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    super();

    const today = new Date().toISOString().split('T')[0];
    this.titheForm = this.fb.group({
      dateReceived: [today, Validators.required],
      amount: [[Validators.required, Validators.min(1)]],
      memberId: [null, Validators.required],
      memberName: ['', Validators.required],
      titheTypeId: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') as string;

    this.fetchTitheData();
  }

  fetchTitheData() {
    this.isLoading.set(true);
    this.titheSvc
      .getTitheById(this.id)
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
        }),
        takeUntil(this.unsubscribe)
      )
      .subscribe({
        next: (resp) => {
          this.amount.setValue(resp.tithe?.amount);
          this.memberId.setValue(resp.tithe?.giver?.id);
          this.dateReceived.setValue(
            new Date(resp.tithe?.dateReceived as string)
              .toISOString()
              .split('T')[0]
          );
          this.memberName.setValue(
            resp.tithe?.giver?.firstName + ' ' + resp.tithe?.giver?.lastName
          );
          this.titheTypeId.setValue(resp.tithe?.titheTypeId);

          setTimeout(() => {
            this.titheTypeDropdown.selectedTitheTypeId.set(
              String(resp.tithe?.titheType?.id)
            );
          }, 100);

          this.memberName.disable();
        },
      });
  }

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

  onMemberSelect($event: string) {
    this.memberName.setValue($event);
    this.memberName.disable();
  }

  onMemberSelectId($event: string) {
    this.memberId.setValue($event);
  }

  saveTithe() {
    if (this.titheForm.invalid) {
      console.log('invalid');
      this.titheForm.markAllAsTouched(); // show errors on submit
      return;
    }
    if (this.titheForm.valid) {
      const newTithe = this.titheForm.value;
      console.log('Saving tithe:', newTithe);

      this.titheSvc
        .updateTithe(this.id, { tithe: this.titheForm.value })
        .pipe(
          finalize(() => {
            this.fetchData.emit(true); // reload table
          }),
          takeUntil(this.unsubscribe)
        )
        .subscribe({
          next: (resp) => {
            this.fetchTitheData();
          },
        });

      // TODO: Call your backend service to save
    }
  }
}

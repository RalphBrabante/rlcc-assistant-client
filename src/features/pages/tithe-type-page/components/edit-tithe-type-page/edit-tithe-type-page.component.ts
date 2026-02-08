import { Component, OnInit, output, signal, ViewChild } from '@angular/core';

import { BaseComponent } from '../../../../../common/directives/base-component';

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
import { TitheTypeService } from '../../../../../common/services/tithe-type.service';

@Component({
  selector: 'app-edit-tithe-type-page',
  templateUrl: './edit-tithe-type-page.component.html',
  styleUrl: './edit-tithe-type-page.component.scss',
})
export class EditTitheTypePageComponent
  extends BaseComponent
  implements OnInit
{
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
    private titheTypeSvc: TitheTypeService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    super();

    this.titheForm = this.fb.group({
      name: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') as string;

    this.fetchTitheData();
  }

  fetchTitheData() {
    this.isLoading.set(true);
    this.titheTypeSvc
      .getTitheTypeId(this.id)
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
        }),
        takeUntil(this.unsubscribe)
      )
      .subscribe({
        next: (resp) => {
          this.name.setValue(resp.data.titheType?.name);
        },
      });
  }

  get name() {
    return this.titheForm.get('name') as FormControl;
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

      this.titheTypeSvc
        .updateTitheType(this.id, this.titheForm.value)
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

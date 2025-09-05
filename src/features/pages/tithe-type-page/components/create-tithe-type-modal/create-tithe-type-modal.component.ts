import { Component, EventEmitter, Output, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TitheTypeService } from '../../../../../common/services/tithe-type.service';
import { takeUntil } from 'rxjs';
import { BaseComponent } from '../../../../../common/directives/base-component';

@Component({
  selector: 'app-create-tithe-type-modal',
  templateUrl: './create-tithe-type-modal.component.html',
  styleUrl: './create-tithe-type-modal.component.scss',
})
export class CreateTitheTypeModalComponent extends BaseComponent {
  @Output() saveTithe = new EventEmitter<any>();
  titheForm: FormGroup;
  isAdding = signal<boolean>(false);

  constructor(private fb: FormBuilder, private titheTypeSvc: TitheTypeService) {
    super();
    this.titheForm = this.fb.group({
      name: ['', [Validators.required]],
    });
  }

  submit() {
    if (this.titheForm.valid) {
      this.titheTypeSvc
        .createTithe(this.titheForm.value)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe({
          next: () => {
            const closeBtn = document.getElementById('titheModalClose');

            closeBtn?.click();
            this.saveTithe.emit(this.titheForm.value);
          },
        });
    }
  }
}

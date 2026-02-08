import { Component, input, OnInit, output, signal } from '@angular/core';
import { TitheType } from '../../../features/pages/tithe-type-page/models/tithe-type'
import { BaseComponent } from '../../directives/base-component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TitheTypeService } from '../../services/tithe-type.service';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-active-tithe-type-dropdown',
  templateUrl: './active-tithe-type-dropdown.component.html',
  styleUrl: './active-tithe-type-dropdown.component.scss',
})
export class ActiveTitheTypeDropdownComponent
  extends BaseComponent
  implements OnInit
{
  titheTypes = signal<TitheType[]>([]);
  emitTitheTypeId = output<string>();
  emitTitheTypeName = output<string>();
  selectedTitheTypeId = signal<string>('');


  constructor(private titheTypeSvc: TitheTypeService) {
    super();
  }

  selectTitheType($event: Event) {
    this.emitTitheTypeId.emit(($event.target as HTMLSelectElement).value);
     this.emitTitheTypeName.emit(($event.target as HTMLSelectElement).selectedOptions[0].text);
  }



  ngOnInit(): void {
    this.titheTypeSvc
      .getAllTitheType()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: (resp) => {
          this.titheTypes.set(resp.data.titheTypes.rows);
        },
      });
  }
}

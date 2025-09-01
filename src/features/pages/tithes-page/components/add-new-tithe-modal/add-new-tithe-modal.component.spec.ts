import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewTitheModalComponent } from './add-new-tithe-modal.component';
import { formatToTwoDecimals } from '../../../../../utils/decimalFormatter';

describe('AddNewTitheModalComponent', () => {
  let component: AddNewTitheModalComponent;
  let fixture: ComponentFixture<AddNewTitheModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddNewTitheModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddNewTitheModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

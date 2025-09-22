import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBulkTithesPageComponent } from './add-bulk-tithes-page.component';

describe('AddBulkTithesPageComponent', () => {
  let component: AddBulkTithesPageComponent;
  let fixture: ComponentFixture<AddBulkTithesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddBulkTithesPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddBulkTithesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

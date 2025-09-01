import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveTitheTypeDropdownComponent } from './active-tithe-type-dropdown.component';

describe('ActiveTitheTypeDropdownComponent', () => {
  let component: ActiveTitheTypeDropdownComponent;
  let fixture: ComponentFixture<ActiveTitheTypeDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActiveTitheTypeDropdownComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActiveTitheTypeDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

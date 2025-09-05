import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TitheTypeTableComponent } from './tithe-type-table.component';

describe('TitheTypeTableComponent', () => {
  let component: TitheTypeTableComponent;
  let fixture: ComponentFixture<TitheTypeTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TitheTypeTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TitheTypeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

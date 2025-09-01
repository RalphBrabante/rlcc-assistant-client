import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TitheTypeComponent } from './tithe-type.component';

describe('TitheTypeComponent', () => {
  let component: TitheTypeComponent;
  let fixture: ComponentFixture<TitheTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TitheTypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TitheTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

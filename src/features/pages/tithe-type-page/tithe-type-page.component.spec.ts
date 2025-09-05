import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TitheTypePageComponent } from './tithe-type-page.component';

describe('TitheTypePageComponent', () => {
  let component: TitheTypePageComponent;
  let fixture: ComponentFixture<TitheTypePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TitheTypePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TitheTypePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

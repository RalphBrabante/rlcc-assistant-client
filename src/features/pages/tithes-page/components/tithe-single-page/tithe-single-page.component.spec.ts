import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TitheSinglePageComponent } from './tithe-single-page.component';

describe('TitheSinglePageComponent', () => {
  let component: TitheSinglePageComponent;
  let fixture: ComponentFixture<TitheSinglePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TitheSinglePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TitheSinglePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

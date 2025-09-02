import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllTitheChartComponent } from './all-tithe-chart.component';

describe('AllTitheChartComponent', () => {
  let component: AllTitheChartComponent;
  let fixture: ComponentFixture<AllTitheChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllTitheChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllTitheChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

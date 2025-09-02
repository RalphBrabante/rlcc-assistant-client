import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTitheChartComponent } from './user-tithe-chart.component';

describe('UserTitheChartComponent', () => {
  let component: UserTitheChartComponent;
  let fixture: ComponentFixture<UserTitheChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserTitheChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserTitheChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

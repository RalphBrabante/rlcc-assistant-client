import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CircleDetailsPageComponent } from './circle-details-page.component';

describe('CircleDetailsPageComponent', () => {
  let component: CircleDetailsPageComponent;
  let fixture: ComponentFixture<CircleDetailsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CircleDetailsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CircleDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

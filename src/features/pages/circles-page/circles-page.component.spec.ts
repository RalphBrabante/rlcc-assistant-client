import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CirclesPageComponent } from './circles-page.component';

describe('CirclesPageComponent', () => {
  let component: CirclesPageComponent;
  let fixture: ComponentFixture<CirclesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CirclesPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CirclesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

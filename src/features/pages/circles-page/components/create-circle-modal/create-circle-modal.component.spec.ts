import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCircleModalComponent } from './create-circle-modal.component';

describe('CreateCircleModalComponent', () => {
  let component: CreateCircleModalComponent;
  let fixture: ComponentFixture<CreateCircleModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateCircleModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateCircleModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

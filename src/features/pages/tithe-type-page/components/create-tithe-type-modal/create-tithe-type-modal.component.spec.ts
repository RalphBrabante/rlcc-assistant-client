import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTitheTypeModalComponent } from './create-tithe-type-modal.component';

describe('CreateTitheTypeModalComponent', () => {
  let component: CreateTitheTypeModalComponent;
  let fixture: ComponentFixture<CreateTitheTypeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateTitheTypeModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateTitheTypeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LifeGroupTypesPageComponent } from './life-group-types-page.component';

describe('LifeGroupTypesPageComponent', () => {
  let component: LifeGroupTypesPageComponent;
  let fixture: ComponentFixture<LifeGroupTypesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LifeGroupTypesPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LifeGroupTypesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

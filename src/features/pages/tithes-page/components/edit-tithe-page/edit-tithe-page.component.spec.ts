import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTithePageComponent } from './edit-tithe-page.component';

describe('EditTithePageComponent', () => {
  let component: EditTithePageComponent;
  let fixture: ComponentFixture<EditTithePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditTithePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditTithePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

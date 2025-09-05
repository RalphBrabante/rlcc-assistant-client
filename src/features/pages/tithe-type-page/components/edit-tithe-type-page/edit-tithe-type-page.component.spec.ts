import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTitheTypePageComponent } from './edit-tithe-type-page.component';

describe('EditTitheTypePageComponent', () => {
  let component: EditTitheTypePageComponent;
  let fixture: ComponentFixture<EditTitheTypePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditTitheTypePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditTitheTypePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

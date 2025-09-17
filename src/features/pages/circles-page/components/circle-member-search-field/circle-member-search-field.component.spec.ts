import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CircleMemberSearchFieldComponent } from './circle-member-search-field.component';

describe('CircleMemberSearchFieldComponent', () => {
  let component: CircleMemberSearchFieldComponent;
  let fixture: ComponentFixture<CircleMemberSearchFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CircleMemberSearchFieldComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CircleMemberSearchFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CirclesTableComponent } from './circles-table.component';

describe('CirclesTableComponent', () => {
  let component: CirclesTableComponent;
  let fixture: ComponentFixture<CirclesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CirclesTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CirclesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

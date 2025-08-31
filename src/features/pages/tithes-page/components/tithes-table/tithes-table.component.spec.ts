import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TithesTableComponent } from './tithes-table.component';

describe('TithesTableComponent', () => {
  let component: TithesTableComponent;
  let fixture: ComponentFixture<TithesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TithesTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TithesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

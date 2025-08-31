import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TithesPageComponent } from './tithes-page.component';

describe('TithesPageComponent', () => {
  let component: TithesPageComponent;
  let fixture: ComponentFixture<TithesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TithesPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TithesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

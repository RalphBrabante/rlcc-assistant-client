import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerseContainerComponent } from './verse-container.component';

describe('VerseContainerComponent', () => {
  let component: VerseContainerComponent;
  let fixture: ComponentFixture<VerseContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerseContainerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerseContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

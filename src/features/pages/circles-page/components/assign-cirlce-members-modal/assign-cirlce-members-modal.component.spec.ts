import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignCirlceMembersModalComponent } from './assign-cirlce-members-modal.component';

describe('AssignCirlceMembersModalComponent', () => {
  let component: AssignCirlceMembersModalComponent;
  let fixture: ComponentFixture<AssignCirlceMembersModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignCirlceMembersModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignCirlceMembersModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTithesTableComponent } from './user-tithes-table.component';

describe('UserTithesTableComponent', () => {
  let component: UserTithesTableComponent;
  let fixture: ComponentFixture<UserTithesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserTithesTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserTithesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

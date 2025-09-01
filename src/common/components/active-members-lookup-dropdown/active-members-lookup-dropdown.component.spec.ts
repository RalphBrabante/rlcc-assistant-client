import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveMembersLookupDropdownComponent } from './active-members-lookup-dropdown.component';

describe('ActiveMembersLookupDropdownComponent', () => {
  let component: ActiveMembersLookupDropdownComponent;
  let fixture: ComponentFixture<ActiveMembersLookupDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActiveMembersLookupDropdownComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActiveMembersLookupDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

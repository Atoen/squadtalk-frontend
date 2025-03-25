import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupParticipantsComponent } from './group-participants.component';

describe('GroupParticipantsComponent', () => {
  let component: GroupParticipantsComponent;
  let fixture: ComponentFixture<GroupParticipantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupParticipantsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupParticipantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

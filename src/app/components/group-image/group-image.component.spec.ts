import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupImageComponent } from './group-image.component';

describe('GroupImageComponent', () => {
  let component: GroupImageComponent;
  let fixture: ComponentFixture<GroupImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupImageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

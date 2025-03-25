import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeGroupNameComponent } from './change-group-name.component';

describe('ChangeGroupNameComponent', () => {
  let component: ChangeGroupNameComponent;
  let fixture: ComponentFixture<ChangeGroupNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangeGroupNameComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeGroupNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

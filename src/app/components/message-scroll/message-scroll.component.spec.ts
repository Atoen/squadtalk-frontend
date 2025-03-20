import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageScrollComponent } from './message-scroll.component';

describe('MessageScrollComponent', () => {
  let component: MessageScrollComponent;
  let fixture: ComponentFixture<MessageScrollComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageScrollComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageScrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

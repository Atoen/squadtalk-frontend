import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-message-input',
  imports: [],
  templateUrl: './message-input.component.html',
  styleUrl: './message-input.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessageInputComponent {

}

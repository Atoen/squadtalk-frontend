import {Component, inject, signal} from '@angular/core';
import {SignalrService} from '../../services/SignalrService';
import {DatePipe} from '@angular/common';
import {MessageDto} from '../../data/dtos/MessageDto';

@Component({
  selector: 'app-messages',
    imports: [DatePipe],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css'
})
export class MessagesComponent {
    signalrService = inject(SignalrService);

    messages = signal<MessageDto[]>([]);

    constructor() {
        this.signalrService.messageReceived$.subscribe(x => {
            this.messages.update(m => [...m, x]);
        });
    }
}

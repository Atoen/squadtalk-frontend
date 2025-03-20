import { Component, input } from '@angular/core';
import { ChatMessage } from "@data/models";
import { FormatTimestampPipe } from "@data/pipes/FormatTimestampPipe";
import { JsonPipe } from "@angular/common";
import { Avatar } from "primeng/avatar";

@Component({
    selector: 'app-chat-message',
    imports: [
        FormatTimestampPipe,
        JsonPipe,
        Avatar
    ],
    templateUrl: './chat-message.component.html',
    styleUrl: './chat-message.component.css'
})
export class ChatMessageComponent {
    model = input.required<ChatMessage>();
    isSeparate = input.required<boolean>();
}

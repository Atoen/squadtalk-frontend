import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ChatManager } from "@services/ChatManager";
import { Button } from "primeng/button";
import { GroupChatComponent } from "@components/group-chat/group-chat.component";

@Component({
    selector: 'app-messages',
    imports: [
        Button,
        GroupChatComponent
    ],
    templateUrl: './messages.component.html',
    styleUrl: './messages.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessagesComponent {
    chatManager = inject(ChatManager);
}

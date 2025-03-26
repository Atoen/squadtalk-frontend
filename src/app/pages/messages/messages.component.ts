import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ChatManager } from "@services/ChatManager";
import { Button } from "primeng/button";
import { GroupChatComponent } from "@components/group-chat/group-chat.component";
import { TranslatePipe } from "@ngx-translate/core";

@Component({
    selector: 'app-messages',
    imports: [
        Button,
        GroupChatComponent,
        TranslatePipe
    ],
    templateUrl: './messages.component.html',
    styleUrl: './messages.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessagesComponent {
    chatManager = inject(ChatManager);

    readonly sortedGroups = computed(() => {
        return this.chatManager.groups()
            .slice()
            .sort((a, b) => {
                const timeA = a.lastMessage()?.timestamp.dateTime.getTime() ?? 0;
                const timeB = b.lastMessage()?.timestamp.dateTime.getTime() ?? 0;

                return timeB - timeA;
            });
    });
}

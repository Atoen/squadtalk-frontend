import { ChangeDetectionStrategy, Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { GroupId } from "@data/ids";
import { ChatManager } from "@services/ChatManager";
import { Router } from "@angular/router";
import { ChatGroup } from "@data/models";

import { TextChatService } from "@services/TextChatService";

import { GroupHeaderComponent } from "@components/group-header/group-header.component";
import { MessageScrollComponent } from "@components/message-scroll/message-scroll.component";
import { MessageInputComponent } from "@components/message-input/message-input.component";

@Component({
    selector: 'app-chat',
    imports: [
        GroupHeaderComponent,
        MessageScrollComponent,
        MessageInputComponent
    ],
    templateUrl: './chat.component.html',
    styleUrl: './chat.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatComponent implements OnInit, OnDestroy {

    textChatService = inject(TextChatService);
    chatManager = inject(ChatManager);
    router = inject(Router);

    groupId!: GroupId;
    group?: ChatGroup;

    @Input()
    set id(groupId: GroupId) {
        this.groupId = groupId;
    }

    ngOnInit() {
        const currentGroup = this.chatManager.currentGroup();
        if (!currentGroup || currentGroup.id !== this.groupId) {
            const group = this.chatManager.getGroup(this.groupId);
            if (!group) {
                void this.router.navigate(['/messages'], { replaceUrl: true });
                return;
            }

            this.chatManager.openGroup(group, false);
            this.group = group;
        } else {
            this.group = currentGroup;
        }
    }

    ngOnDestroy() {
        this.chatManager.clearSelectedGroup();
    }

    async sendMessage() {
        if (this.group) {
            await this.textChatService.sendMessage("oro message", this.group);
        }
    }
}

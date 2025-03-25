import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { TranslatePipe } from "@ngx-translate/core";
import { InputText } from "primeng/inputtext";
import { FloatLabel } from "primeng/floatlabel";
import { Button } from "primeng/button";
import { FormsModule } from "@angular/forms";
import { ContactManager } from "@services/ContactManager";
import { InputGroup } from "primeng/inputgroup";
import { InputGroupAddon } from "primeng/inputgroupaddon";
import { Message } from "primeng/message";
import { FriendRequestResult } from "@data/enums";

@Component({
    selector: 'app-add-friend',
    imports: [
        TranslatePipe,
        InputText,
        FloatLabel,
        Button,
        FormsModule,
        InputGroup,
        InputGroupAddon,
        Message
    ],
    templateUrl: './add-friend.component.html',
    styleUrl: './add-friend.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddFriendComponent {

    contactManager = inject(ContactManager);
    friendUsername = '';

    messageData = signal<MessageData | null>(null);

    addFriend() {
        const username = this.friendUsername;
        this.friendUsername = '';

        if (!username) return;

        this.contactManager.sendFriendRequest(username)
            .then(x => this.displayMessage(username, x));
    }

    private displayMessage(username: string, result: FriendRequestResult) {
        const messagesMap: Record<FriendRequestResult, string> = {
            [FriendRequestResult.Success]: `Friend request sent to ${username}.`,
            [FriendRequestResult.RecipientNotFound]: `User ${username} not found.`,
            [FriendRequestResult.SelfRequest]: `You cannot send a friend request to yourself.`,
            [FriendRequestResult.RequestAlreadyPending]: `You already sent a request to ${username}.`,
            [FriendRequestResult.AlreadyFriends]: `You are already friends with ${username}.`,
            [FriendRequestResult.Error]: `Something went wrong while sending a request to ${username}. `,
        };

        const text = messagesMap[result];
        const severity = result === FriendRequestResult.Success
            ? 'success'
            : result === FriendRequestResult.Error ? 'error' : 'warn';

        const data: MessageData = { text, severity }

        this.messageData.set(data);
    }

    hideMessage() {
        this.messageData.set(null);
    }
}

type MessageData = { text: string, severity: string }

import { Component, inject, ViewChild } from '@angular/core';
import { ContactManager } from "../../services/ContactManager";
import { AvatarBadgeComponent } from "../avatar-badge/avatar-badge.component";
import { Button } from "primeng/button";
import { NgIcon, provideIcons } from "@ng-icons/core";
import { Tooltip } from "primeng/tooltip";
import { matMessageRound, matMoreVertRound } from "@ng-icons/material-icons/round"
import { Popover } from "primeng/popover";
import { User } from "../../data/models/User";
import { ConfirmationService } from "primeng/api";
import { ConfirmDialog } from "primeng/confirmdialog";

@Component({
    selector: 'app-friend-list',
    imports: [
        AvatarBadgeComponent,
        Button,
        NgIcon,
        Tooltip,
        Popover,
        ConfirmDialog
    ],
    templateUrl: './friend-list.component.html',
    styleUrl: './friend-list.component.css',
    providers: [
        provideIcons({matMessageRound, matMoreVertRound}),
        ConfirmationService
    ]
})
export class FriendListComponent {

    private confirmationService = inject(ConfirmationService);
    contactManager = inject(ContactManager);

    @ViewChild('more') morePopover!: Popover;

    selectedFriend?: User;

    displayMore(event: Event, friend: User) {
        if (this.selectedFriend?.id === friend.id) {
            this.morePopover.hide();
            this.selectedFriend = undefined;
        } else {
            this.selectedFriend = friend;
            this.morePopover.show(event);
        }
    }

    messageFriend(friend: User) {
        this.morePopover.hide();
    }

    callSelectedFriend() {
        this.morePopover.hide();
    }

    removeSelectedFriend(event: Event) {
        const friend = this.selectedFriend;
        this.morePopover.hide();

        this.confirmationService.confirm({
            target: event.target as EventTarget,
            closable: true,
            closeOnEscape: true,
            message: 'u sure??',
            rejectButtonProps: {
                label: 'Cancel',
                severity: 'secondary',
                outlined: true
            },
            acceptButtonProps: {
                label: 'Delete',
                severity: 'danger'
            },
            accept: async () => {
                if (friend) {
                    await this.contactManager.removeFriend(friend);
                }
            }
        });
    }
}

import { Component, inject, ViewChild } from '@angular/core';
import { ContactManager } from "../../services/ContactManager";
import { AvatarBadgeComponent } from "../avatar-badge/avatar-badge.component";
import { Button } from "primeng/button";
import { NgIcon, provideIcons } from "@ng-icons/core";
import { Tooltip } from "primeng/tooltip";
import { matMessageRound, matMoreVertRound } from "@ng-icons/material-icons/round"
import { Popover } from "primeng/popover";
import { User } from "../../data/models/User";

@Component({
    selector: 'app-friend-list',
    imports: [
        AvatarBadgeComponent,
        Button,
        NgIcon,
        Tooltip,
        Popover
    ],
    templateUrl: './friend-list.component.html',
    styleUrl: './friend-list.component.css',
    providers: [provideIcons({matMessageRound, matMoreVertRound})]
})
export class FriendListComponent {
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

    removeSelectedFriend() {
        this.morePopover.hide();
    }
}

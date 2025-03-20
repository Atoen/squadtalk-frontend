import { Component, computed, inject } from '@angular/core';
import { ContactManager } from "../../services";
import { AvatarBadgeComponent } from "../avatar-badge/avatar-badge.component";
import { Divider } from "primeng/divider";
import { Button } from "primeng/button";
import { matCheckRound, matCloseRound } from "@ng-icons/material-icons/round";
import { NgIcon, provideIcons } from "@ng-icons/core";
import { Tooltip } from "primeng/tooltip";
import { IncomingFriendRequest, OutgoingFriendRequest } from "@data/models";

@Component({
    selector: 'app-friend-requests',
    imports: [
        AvatarBadgeComponent,
        Divider,
        Button,
        NgIcon,
        Tooltip
    ],
    templateUrl: './friend-requests.component.html',
    styleUrl: './friend-requests.component.css',
    providers: [provideIcons({matCheckRound, matCloseRound})]
})
export class FriendRequestsComponent {
    contactManager = inject(ContactManager);

    incomingRequestsAvailable = computed(() => this.contactManager.incomingFriendRequests().length > 0);
    outgoingRequestsAvailable = computed(() => this.contactManager.outgoingFriendRequests().length > 0);
    requestsAvailable = computed(() => this.incomingRequestsAvailable() || this.outgoingRequestsAvailable());

    async acceptFriendRequest(friendRequest: IncomingFriendRequest) {
        await this.contactManager.respondToFriendRequest(friendRequest, true);
    }

    async declineFriendRequest(friendRequest: IncomingFriendRequest) {
        await this.contactManager.respondToFriendRequest(friendRequest, false);
    }

    async cancelFriendRequest(friendRequest: OutgoingFriendRequest) {
        await this.contactManager.cancelFriendRequest(friendRequest);
    }
}

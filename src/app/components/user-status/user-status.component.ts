import { ChangeDetectionStrategy, Component, computed, inject, input, ViewChild } from '@angular/core';
import { AuthenticationState, ContactManager, UserAuthenticationService } from "../../services";
import { NgIf } from "@angular/common";
import {
    matAccessTimeFilledRound,
    matCircleRound,
    matDoNotDisturbOnRound,
    matWifiRound
} from "@ng-icons/material-icons/round";
import { UserStatus } from "@data/enums";
import { NgIcon, provideIcons } from "@ng-icons/core";
import { Ripple } from "primeng/ripple";
import { Popover } from "primeng/popover";
import { AvatarBadgeComponent } from "../avatar-badge/avatar-badge.component";

@Component({
    selector: 'app-user-status',
    imports: [
        NgIf,
        NgIcon,
        Ripple,
        Popover,
        AvatarBadgeComponent,
    ],
    templateUrl: './user-status.component.html',
    styleUrl: './user-status.component.css',
    viewProviders: [provideIcons({
        matCircleRound,
        matAccessTimeFilledRound,
        matDoNotDisturbOnRound,
        matWifiRound
    })],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserStatusComponent {
    authService = inject(UserAuthenticationService);
    contactManager = inject(ContactManager);

    @ViewChild('status_menu', { static: true }) statusMenu!: Popover;

    sidebarExpanded = input.required<boolean>();

    protected readonly AuthenticationState = AuthenticationState;

    private static readonly statusTextMap = {
        [UserStatus.Unknown]: "Connecting",
        [UserStatus.Online]: "Online",
        [UserStatus.Away]: "Away",
        [UserStatus.DoNotDisturb]: "Do not disturb",
        [UserStatus.Offline]: "Offline"
    };

    statusText = computed(() => UserStatusComponent.statusTextMap[this.contactManager.userStatus()]);

    async setSelfStatus(status: UserStatus) {
        this.statusMenu.hide();

        if (this.contactManager.userStatus() !== UserStatus.Unknown) {
            await this.contactManager.setStatus(status);
        }
    }

    protected readonly UserStatus = UserStatus;
}

import { Component, computed, inject, input, ViewChild } from '@angular/core';
import { AuthenticationState, UserAuthenticationService } from "../../services/UserAuthenticationService";
import { NgIf } from "@angular/common";
import {
    matCircleRound,
    matAccessTimeFilledRound,
    matDoNotDisturbOnRound,
    matWifiRound
} from "@ng-icons/material-icons/round";
import { SignalrService } from "../../services/SignalrService";
import { UserStatus } from "../../data/enums/UserStatus";
import { NgIcon, provideIcons } from "@ng-icons/core";
import { Ripple } from "primeng/ripple";
import { Popover } from "primeng/popover";

@Component({
    selector: 'app-user-status',
    imports: [
        NgIf,
        NgIcon,
        Ripple,
        Popover
    ],
    templateUrl: './user-status.component.html',
    styleUrl: './user-status.component.css',
    viewProviders: [provideIcons({
        matCircleRound,
        matAccessTimeFilledRound,
        matDoNotDisturbOnRound,
        matWifiRound
    })]
})
export class UserStatusComponent {
    authService = inject(UserAuthenticationService);
    signalrService = inject(SignalrService);

    @ViewChild('status_menu') statusMenu!: Popover;

    sidebarExpanded = input.required<boolean>();

    protected readonly AuthenticationState = AuthenticationState;

    private static readonly statusMap = {
        [UserStatus.Unknown]: { text: "Connecting", icon: "matWifiRound", color: "var(--info)" },
        [UserStatus.Online]: { text: "Online", icon: "matCircleRound", color: "var(--success)" },
        [UserStatus.Away]: { text: "Away", icon: "matAccessTimeFilledRound", color: "var(--warn)" },
        [UserStatus.DoNotDisturb]: { text: "Do not disturb", icon: "matDoNotDisturbOnRound", color: "var(--error)" },
        [UserStatus.Offline]: { text: "Offline", icon: "matCircleRound", color: "var(--dark)" }
    };

    status = computed(() => UserStatusComponent.statusMap[this.signalrService.userStatus()]);

    async setSelfStatus(status: UserStatus) {
        this.statusMenu.hide();

        if (this.signalrService.userStatus() !== UserStatus.Unknown) {
            await this.signalrService.setSelfStatus(status);
        }
    }

    protected readonly UserStatus = UserStatus;
}

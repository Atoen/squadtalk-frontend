import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { UserStatus } from "@data/enums";
import {
    matAccessTimeFilledRound,
    matCircleRound,
    matDoNotDisturbOnRound,
    matWifiRound
} from "@ng-icons/material-icons/round";
import { NgIcon, provideIcons } from "@ng-icons/core";
import { Avatar } from "primeng/avatar";
import { User } from "@data/models";

@Component({
    selector: 'app-avatar-badge',
    imports: [
        Avatar,
        NgIcon
    ],
    templateUrl: './avatar-badge.component.html',
    styleUrl: './avatar-badge.component.css',
    viewProviders: [provideIcons({
        matCircleRound,
        matAccessTimeFilledRound,
        matDoNotDisturbOnRound,
        matWifiRound
    })],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AvatarBadgeComponent {

    size = input<'normal' | 'large' | 'xlarge'>();
    displayOfflineBadge = input<boolean>(true);
    user = input.required<User>();

    private static readonly statusMap = {
        [UserStatus.Unknown]: { text: "Connecting", icon: "matWifiRound", color: "var(--info)" },
        [UserStatus.Online]: { text: "Online", icon: "matCircleRound", color: "var(--success)" },
        [UserStatus.Away]: { text: "Away", icon: "matAccessTimeFilledRound", color: "var(--warn)" },
        [UserStatus.DoNotDisturb]: { text: "Do not disturb", icon: "matDoNotDisturbOnRound", color: "var(--error)" },
        [UserStatus.Offline]: { text: "Offline", icon: "matCircleRound", color: "var(--gray)" }
    };

    statusData = computed(() => AvatarBadgeComponent.statusMap[this.user().status()]);
    protected readonly UserStatus = UserStatus;
}

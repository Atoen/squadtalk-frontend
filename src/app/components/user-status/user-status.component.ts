import { ChangeDetectionStrategy, Component, inject, input, ViewChild } from '@angular/core';
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
import { TranslatePipe } from "@ngx-translate/core";
import { SelfStatusNamePipe } from "@data/pipes/StatusNamePipe";

@Component({
    selector: 'app-user-status',
    imports: [
        NgIf,
        NgIcon,
        Ripple,
        Popover,
        AvatarBadgeComponent,
        TranslatePipe,
        SelfStatusNamePipe,
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
    protected readonly AuthenticationState = AuthenticationState;
    protected readonly UserStatus = UserStatus;

    authService = inject(UserAuthenticationService);
    contactManager = inject(ContactManager);

    sidebarExpanded = input.required<boolean>();

    @ViewChild('status_menu', { static: true }) statusMenu!: Popover;

    async setSelfStatus(status: UserStatus) {
        this.statusMenu.hide();

        if (this.contactManager.userStatus() !== UserStatus.Unknown) {
            await this.contactManager.setStatus(status);
        }
    }
}

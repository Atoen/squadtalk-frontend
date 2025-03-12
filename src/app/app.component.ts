import {Component, Inject, inject, OnInit, PLATFORM_ID, untracked} from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
    matHomeRound,
    matLoginRound,
    matLogoutRound,
    matPersonAddRound,
    matSettingsRound,
    matPeopleRound,
    matMessageRound
} from '@ng-icons/material-icons/round';
import { Divider } from 'primeng/divider';
import { UserStatusComponent } from "./components/user-status/user-status.component";
import { AuthenticationState, UserAuthenticationService } from "./services/UserAuthenticationService";
import { isPlatformBrowser, NgIf } from "@angular/common";
import { SignalrService } from "./services/SignalrService";
import { Toast } from "primeng/toast";
import { Ripple } from "primeng/ripple";

@Component ({
    selector: 'app-root',
    imports: [
        RouterOutlet,
        RouterLink,
        NgIcon,
        RouterLinkActive,
        Divider,
        UserStatusComponent,
        NgIf,
        Toast,
        Ripple,
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    viewProviders: [provideIcons ({
        matHomeRound,
        matLoginRound,
        matSettingsRound,
        matPersonAddRound,
        matLogoutRound,
        matMessageRound,
        matPeopleRound
    })],
})
export class AppComponent implements OnInit {
    constructor(
        @Inject(PLATFORM_ID) private readonly platformId: Object,
        public readonly authService: UserAuthenticationService) {}

    ngOnInit() {
        if (!isPlatformBrowser(this.platformId)) return;

        console.log("Auth state", this.authService.authenticationState());
        console.log("Logged in", this.authService.isLoggedIn());

        if (untracked(this.authService.authenticationState) === AuthenticationState.PendingVerification) {
            this.authService.verifyCurrentUser();
        }
    }

    protected readonly AuthenticationState = AuthenticationState;

    logOut() {
        this.authService.logOut();
    }

    isExpanded = false;

    toggleSidebar(event: Event) {
        if (window.innerWidth <= 767 && event.target === event.currentTarget) {
            this.isExpanded = !this.isExpanded;
        }
    }

    hideSidebar() {
        this.isExpanded = false;
    }
}

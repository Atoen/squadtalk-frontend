import { Component, inject, OnInit, PLATFORM_ID, untracked } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { NgIcon, provideIcons } from '@ng-icons/core';
import {
    matHomeRound,
    matLoginRound,
    matLogoutRound,
    matPersonAddRound,
    matSettingsRound
} from '@ng-icons/material-icons/round';
import { Divider } from 'primeng/divider';
import { UserStatusComponent } from "./components/user-status/user-status.component";
import { AuthenticationState, UserAuthenticationService } from "./services/UserAuthenticationService";
import { isPlatformBrowser, NgIf } from "@angular/common";
import { SignalrService } from "./services/SignalrService";

@Component ({
    selector: 'app-root',
    imports: [RouterOutlet, RouterLink, NgIcon, RouterLinkActive, Divider, UserStatusComponent, NgIf],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    viewProviders: [provideIcons ({ matHomeRound, matLoginRound, matSettingsRound, matPersonAddRound, matLogoutRound })],
})
export class AppComponent implements OnInit {

    private platformId = inject(PLATFORM_ID);
    private signalrService = inject(SignalrService);

    authService = inject(UserAuthenticationService);

    ngOnInit() {
        if (!isPlatformBrowser(this.platformId)) return;

        if (this.authService.tryReadStoredUser()) {
            this.authService.verifyCurrentUser();
        }

        if (untracked(this.authService.isLoggedIn)) {
            this.signalrService.connect();
        }
    }

    protected readonly AuthenticationState = AuthenticationState;

    logOut() {
        this.authService.logOut();
    }
}

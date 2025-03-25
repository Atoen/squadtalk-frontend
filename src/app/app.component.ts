import { ChangeDetectionStrategy, Component, inject, Inject, OnInit, PLATFORM_ID, untracked } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
    matHomeRound,
    matLoginRound,
    matLogoutRound,
    matMessageRound,
    matPeopleRound,
    matPersonAddRound,
    matSettingsRound
} from '@ng-icons/material-icons/round';
import { Divider } from 'primeng/divider';
import { UserStatusComponent } from "@components/user-status/user-status.component";
import { AuthenticationState, ContactManager, UserAuthenticationService } from "./services";
import { isPlatformBrowser, NgIf } from "@angular/common";
import { Toast } from "primeng/toast";
import { Ripple } from "primeng/ripple";
import { UserPreferencesManager } from "@services/UserPreferencesManager";
import { TranslateModule } from "@ngx-translate/core";
import { TextChatService } from "@services/TextChatService";

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
        TranslateModule
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
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {

    // Injecting at root to make sure it is instantiated early
    preferencesManager = inject(UserPreferencesManager);
    textChatService = inject(TextChatService);
    contactManager = inject(ContactManager);

    constructor(
        @Inject(PLATFORM_ID) private readonly platformId: Object,
        readonly authService: UserAuthenticationService
    ) {}

    ngOnInit() {
        if (!isPlatformBrowser(this.platformId)) return;

        console.log("Auth state", this.authService.authenticationState());
        console.log("Logged in", this.authService.isLoggedIn());

        if (untracked(this.authService.authenticationState) === AuthenticationState.PendingVerification) {
            void this.authService.verifyCurrentUser();
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

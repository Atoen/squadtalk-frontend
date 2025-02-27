import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { matHomeRound, matLoginRound, matSettingsRound, matPersonAddRound } from '@ng-icons/material-icons/round';
import { Divider } from 'primeng/divider';

@Component ({
    selector: 'app-root',
    imports: [RouterOutlet, RouterLink, NgIcon, RouterLinkActive, Divider],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    viewProviders: [provideIcons ({ matHomeRound, matLoginRound, matSettingsRound, matPersonAddRound })]
})
export class AppComponent {
}

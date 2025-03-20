import { Component, input } from '@angular/core';
import { matCallRound, matSettingsRound, matPersonAddAlt1Round } from '@ng-icons/material-icons/round';
import { ChatGroup } from "@data/models";
import { NgIcon, provideIcons } from "@ng-icons/core";
import { Button } from "primeng/button";

@Component({
    selector: 'app-group-header',
    imports: [
        Button,
        NgIcon
    ],
    templateUrl: './group-header.component.html',
    styleUrl: './group-header.component.css',
    providers: [provideIcons({ matCallRound, matSettingsRound, matPersonAddAlt1Round })]
})
export class GroupHeaderComponent {
    model = input.required<ChatGroup>();
}

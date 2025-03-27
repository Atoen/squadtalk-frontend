import { ChangeDetectionStrategy, Component, inject, input, Type, ViewChild } from '@angular/core';
import {
    matCallRound,
    matDeleteForeverRound,
    matEditRound,
    matExitToAppRound,
    matImageRound,
    matPeopleRound,
    matPersonAddAlt1Round,
    matSettingsRound
} from '@ng-icons/material-icons/round';
import { ChatGroup, User } from "@data/models";
import { NgIcon, provideIcons } from "@ng-icons/core";
import { Button } from "primeng/button";
import { Popover } from "primeng/popover";
import { Divider } from "primeng/divider";
import { SelectFriendsComponent } from "@components/dialogs/select-friends/select-friends.component";
import { FriendsSelectionType } from "@data/enums/FriendSelectionType";
import { DialogService } from "primeng/dynamicdialog";
import { firstValueFrom } from "rxjs";
import { GroupParticipantsComponent } from "@components/dialogs/group-participants/group-participants.component";
import { ChangeGroupNameComponent } from "@components/dialogs/change-group-name/change-group-name.component";
import { GroupRolePermissions } from "../../util/GroupParticipantPermissions";
import { TranslatePipe, TranslateService } from "@ngx-translate/core";

@Component({
    selector: 'app-group-header',
    imports: [
        Button,
        NgIcon,
        Popover,
        Divider,
        TranslatePipe
    ],
    templateUrl: './group-header.component.html',
    styleUrl: './group-header.component.css',
    providers: [
        provideIcons({
            matCallRound,
            matSettingsRound,
            matPersonAddAlt1Round,
            matEditRound,
            matImageRound,
            matPeopleRound,
            matExitToAppRound,
            matDeleteForeverRound
        })
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupHeaderComponent {
    readonly dialogService = inject(DialogService);
    readonly translateService = inject(TranslateService);

    model = input.required<ChatGroup>();

    @ViewChild('manage') manageMenu!: Popover;

    async showAddFriendDialog() {
        const result = await this.openDialog(
            SelectFriendsComponent,
            this.translateService.instant('manage_group.add_friends'),
            {
                selectionType: FriendsSelectionType.InviteToGroup,
                group: this.model()
            }
        ) as User[] | undefined;

        if (result) {
            console.log("Selected friends:", result);
        } else {
            console.log("Didn't select friends");
        }
    }

    showChangeGroupNameDialog() {
        void this.openDialog(
            ChangeGroupNameComponent,
            this.translateService.instant('manage_group.change_name'),
            { group: this.model() }
        );
    }

    showGroupParticipantsDialog() {
        void this.openDialog(
            GroupParticipantsComponent,
            this.translateService.instant('manage_group.participants'),
            { group: this.model() }
        );
    }

    private async openDialog<C>(component: Type<C>, header?: string, data?: any) {
        this.manageMenu.hide();

        const dialogRef = this.dialogService.open(component, {
            header,
            showHeader: !!header,
            focusTrap: true,
            modal: true,
            dismissableMask: true,
            closable: true,
            width: "400px",
            data
        });

        return await firstValueFrom(dialogRef.onClose);
    }

    protected readonly GroupRolePermissions = GroupRolePermissions;
}

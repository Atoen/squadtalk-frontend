import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal, untracked } from '@angular/core';
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { ChatGroup, GroupParticipant } from "@data/models";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "primeng/tabs";
import { AvatarBadgeComponent } from "@components/avatar-badge/avatar-badge.component";
import { GroupRole } from "@data/enums";
import { matEditRound, matPersonRemoveRound } from "@ng-icons/material-icons/round";
import { NgIcon, provideIcons } from "@ng-icons/core";
import { Button } from "primeng/button";
import { ConfirmationService, MessageService } from "primeng/api";
import { ConfirmPopup } from "primeng/confirmpopup";
import { TranslatePipe } from "@ngx-translate/core";
import { GroupRoleNamePipe } from "@data/pipes/GroupRoleNamePipe";

@Component({
    selector: 'app-group-participants',
    imports: [
        Tab,
        Tabs,
        TabList,
        TabPanels,
        TabPanel,
        AvatarBadgeComponent,
        Button,
        NgIcon,
        ConfirmPopup,
        TranslatePipe,
        GroupRoleNamePipe
    ],
    templateUrl: './group-participants.component.html',
    styleUrl: './group-participants.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
    viewProviders: [provideIcons({
        matEditRound, matPersonRemoveRound
    })]
})
export class GroupParticipantsComponent implements OnInit {

    readonly GroupRole = GroupRole;

    readonly dialogRef = inject(DynamicDialogRef);
    readonly dialogService = inject(DialogService);
    readonly confirmationService = inject(ConfirmationService);
    readonly messageService = inject(MessageService);

    group!: ChatGroup;
    localUser!: GroupParticipant;

    ngOnInit() {
        const dialogInstance = this.dialogService.getInstance(this.dialogRef);
        if (!dialogInstance || !dialogInstance.data) {
            this.dialogRef.close();
        }

        this.group = dialogInstance.data['group'];
        this.localUser = this.group.localUser;
    }

    private readonly collator = Intl.Collator('en');

    readonly sortedParticipants = computed(() => {
        return this.group.participants().slice()
            .sort((a, b) =>
                this.collator.compare(a.user.username(), b.user.username())
            );
    })

    readonly moderators = computed(() => {
        return this.sortedParticipants()
            .filter(x => x.isModeratorOrAbove());
    });

    readonly roleDialogVisible = signal(false);

    removeParticipant(event: Event, participant: GroupParticipant) {
        const username = untracked(participant.user.username);
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            closable: true,
            closeOnEscape: true,
            message: `Are you sure you want to remove ${username} from the group?`,
            rejectButtonProps: {
                label: 'Cancel',
                severity: 'secondary',
                outlined: true
            },
            acceptButtonProps: {
                label: 'Remove',
                severity: 'danger'
            },
            accept: () => {
                this.messageService.add({
                    severity: 'info',
                    summary: 'User removed',
                    detail: `Removed ${username} from the group`,
                    life: 5000
                })
            }
        })
    }
}

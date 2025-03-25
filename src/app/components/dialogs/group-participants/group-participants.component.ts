import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { ChatGroup, GroupParticipant } from "@data/models";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "primeng/tabs";
import { AvatarBadgeComponent } from "@components/avatar-badge/avatar-badge.component";
import { GroupRole } from "@data/enums";

@Component({
    selector: 'app-group-participants',
    imports: [
        Tab,
        Tabs,
        TabList,
        TabPanels,
        TabPanel,
        AvatarBadgeComponent
    ],
    templateUrl: './group-participants.component.html',
    styleUrl: './group-participants.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupParticipantsComponent {

    readonly dialogRef = inject(DynamicDialogRef);
    readonly dialogService = inject(DialogService);

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

    readonly sortedUsers = computed(() => {
        return this.group.participants().slice()
            .sort((a, b) =>
                this.collator.compare(a.user.username(), b.user.username())
            );
    })

    readonly moderators = computed(() => {
        return this.sortedUsers()
            .filter(x => x.isModeratorOrAbove());
    });

    protected readonly GroupRole = GroupRole;
}

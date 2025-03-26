import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { ChatGroup, User } from "@data/models";
import { matCheckBoxOutlineBlankRound, matCheckBoxRound, matCloseRound } from "@ng-icons/material-icons/round";
import { ContactManager } from "@services/ContactManager";
import { AvatarBadgeComponent } from "@components/avatar-badge/avatar-badge.component";
import { NgIcon, provideIcons } from "@ng-icons/core";
import { InputText } from "primeng/inputtext";
import { FormsModule } from "@angular/forms";
import { FloatLabel } from "primeng/floatlabel";
import { Fluid } from "primeng/fluid";
import { Ripple } from "primeng/ripple";
import { Button } from "primeng/button";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { FriendsSelectionType } from "@data/enums/FriendSelectionType";

@Component({
    selector: 'app-select-friends',
    imports: [
        AvatarBadgeComponent,
        NgIcon,
        InputText,
        FormsModule,
        FloatLabel,
        Fluid,
        Ripple,
        Button
    ],
    templateUrl: './select-friends.component.html',
    styleUrl: './select-friends.component.css',
    viewProviders: [provideIcons({ matCloseRound, matCheckBoxRound, matCheckBoxOutlineBlankRound })],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectFriendsComponent implements OnInit {

    readonly contactManager = inject(ContactManager);
    readonly dialogRef = inject(DynamicDialogRef);
    readonly dialogService = inject(DialogService);

    private selectionType: FriendsSelectionType = FriendsSelectionType.CreateGroup;
    private group?: ChatGroup;

    ngOnInit() {
        const dialogInstance = this.dialogService.getInstance(this.dialogRef);
        if (!dialogInstance || !dialogInstance.data) {
            this.dialogRef.close();
        }

        const data = dialogInstance.data;

        this.selectionType = data['selectionType'];
        if (this.selectionType === FriendsSelectionType.InviteToGroup) {
            this.group = data['group'];
        }
    }

    private readonly collator = Intl.Collator('en');

    readonly searchText = signal('');

    private readonly searchResults = computed(() => {
        const group = this.group;
        if (this.selectionType === FriendsSelectionType.InviteToGroup && !group) {
            return [];
        }

        const friends = this.contactManager.friends();
        const filteredFriends = this.selectionType === FriendsSelectionType.InviteToGroup
            ? friends.filter(x => !group!.others().some(u => u.user === x))
            : friends;

        return filteredFriends
            .map(x => new SearchResult(x))
            .sort((a, b) => this.collator.compare(a.username(), b.username()));
    });

    readonly selectedFriends = computed(() => {
        return this.searchResults().filter(x => x.isSelected());
    });

    readonly selectedNone = computed(() => this.selectedFriends().length === 0);

    readonly filteredFriends = computed(() => {
        const text = this.searchText().toLowerCase();
        const result = text === ''
            ? this.searchResults()
            : this.searchResults()
                .filter(x => x.username().toLowerCase().includes(text));

        return result.slice(0, 10);
    });

    closeChip(clicked: SearchResult) {
        clicked.isSelected.set(false);
    }

    clickResult(clicked: SearchResult) {
        clicked.isSelected.update(x => !x);
    }

    confirmSelection() {
        const selected = this.selectedFriends().map(x => x.user);
        this.dialogRef.close(selected);
    }
}

export class SearchResult {
    constructor(readonly user: User) {}

    isSelected = signal(false);

    get id() {
        return this.user.id;
    }

    get username() {
        return this.user.username;
    }
}

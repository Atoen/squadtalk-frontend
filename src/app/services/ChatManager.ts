import { SignalrService } from "./SignalrService";
import { ContactManager } from "./ContactManager";
import { UserAuthenticationService } from "./UserAuthenticationService";
import { ChatGroup, GroupParticipant } from "@data/models";
import { Injectable, signal, Signal, untracked } from "@angular/core";
import { ReactiveMap } from "../data";
import { GroupId } from "@data/ids";
import { HubMethodInvoker } from "../signalr";
import { Func } from "../util";
import { GroupDto, GroupParticipantDto } from "@data/dtos";
import { Router } from "@angular/router";

@Injectable({providedIn: "root"})
export class ChatManager {

    private readonly _hubInvoker: HubMethodInvoker;

    private readonly _groups = new ReactiveMap<GroupId, ChatGroup>();
    private readonly _currentGroup = signal<ChatGroup | undefined>(undefined);

    readonly groups: Signal<ChatGroup[]> = this._groups.values;
    readonly currentGroup = this._currentGroup.asReadonly();

    readonly groupParticipantProvider: Func<GroupParticipantDto, GroupParticipant>;

    constructor(
        private readonly contactManager: ContactManager,
        private readonly authService: UserAuthenticationService,
        private readonly router: Router,
        signalrService: SignalrService
    ) {
        this._hubInvoker = signalrService.methodInvoker;
        this.groupParticipantProvider = (dto) => {
            return GroupParticipant.create(dto, this.contactManager.userModelProvider);
        };

        if (!signalrService.connectionCreated) return;

        const hubHandler = signalrService.eventHandler;
        hubHandler.groupNameChanged$.subscribe(({ groupId, name }) => this.groupNameChanged(groupId, name));

        void this.refreshGroups();
    }

    getGroup(groupId: GroupId) {
        return this._groups.get(groupId);
    }

    openGroup(group: ChatGroup, navigate: boolean = true) {
        if (untracked(this._currentGroup) === group) return;

        this._currentGroup.set(group);

        if (navigate) {
            void this.router.navigate([`/chat/${group.id}`]);
        }
    }

    clearSelectedGroup() {
        this._currentGroup.set(undefined);
    }

    async refreshGroups() {
        const result = await this._hubInvoker.getGroups();
        if (result.isError) return;

        const groups: [GroupId, ChatGroup][] = result.value
            .map(GroupDto.unpack)
            .map(x => ChatGroup.create(x, this.contactManager.userModelProvider))
            .map(x => [x.id, x]);

        this._groups.refresh(groups);
    }

    private groupNameChanged(groupId: GroupId, name?: string) {
        const group = this._groups.get(groupId);
        if (group) {
            group.customName.set(name);
        }
    }
}
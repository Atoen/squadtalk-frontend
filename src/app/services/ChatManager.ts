import { Injectable } from "@angular/core";
import { ReactiveMap } from "../data/ReactiveMap";
import { GroupId } from "../data/ids/GroupId";
import { ChatGroup } from "../data/models/ChatGroup";
import { SignalrService } from "./SignalrService";
import { UserAuthenticationService } from "./UserAuthenticationService";
import { ContactManager } from "./ContactManager";
import { HubMethodInvoker } from "../signalr/HubMethodInvoker";
import { GroupDto } from "../data/dtos/GroupDto";
import { GroupParticipantDto } from "../data/dtos/GroupParticipantDto";
import { GroupParticipant } from "../data/models/GroupParticipant";
import { Func } from "../util/Delegate";

@Injectable({providedIn: "root"})
export class ChatManager {

    private readonly _groups = new ReactiveMap<GroupId, ChatGroup>();
    private readonly _hubInvoker: HubMethodInvoker;

    readonly groups = this._groups.values;

    readonly groupParticipantProvider: Func<GroupParticipantDto, GroupParticipant>;

    constructor(
        private readonly contactManager: ContactManager,
        private readonly authService: UserAuthenticationService,
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
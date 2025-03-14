import {GroupParticipant} from "./GroupParticipant";
import {GroupId} from "../ids/GroupId";
import {ChatMessage} from "./ChatMessage";
import {GroupDto} from "../dtos/GroupDto";
import {GroupParticipantDto} from "../dtos/GroupParticipantDto";
import {GroupState} from './GroupState';
import { signal, Signal, WritableSignal } from '@angular/core';
import { Func } from "../../util/Delegate";
import { UserDto } from "../dtos/UserDto";
import { User } from "./User";

export class ChatGroup {
    readonly customName: WritableSignal<string | undefined>;
    readonly participants: WritableSignal<GroupParticipant[]>;
    readonly others: WritableSignal<GroupParticipant[]>;
    readonly lastMessage: WritableSignal<ChatMessage | undefined>;
    readonly unreadMessages: WritableSignal<number>;
    readonly localUser: GroupParticipant;
    readonly id: GroupId;

    readonly state: GroupState;

    readonly messages: Signal<ChatMessage[]>;

    private constructor(
        dto: GroupDto,
        participantProvider: Func<GroupParticipantDto, GroupParticipant>
    ) {
        this.id = dto.id;
        this.customName = signal(dto.customName);
        this.unreadMessages = signal(dto.messagesSince);
        this.lastMessage = signal<ChatMessage | undefined>(undefined);

        const participants = dto.participants.map(participantProvider);

        this.participants = signal(participants);
        this.others = signal(participants.filter(x => x.user.isRemote));
        this.localUser = participants.find(x => x.user.isLocal)!;

        this.state = new GroupState(this);
        this.messages = this.state.messages.asReadonly();
    }

    static create(
        dto: GroupDto,
        userProvider: Func<UserDto, User>
    ) {
        const participantProvider = this.createGroupParticipant(userProvider);
        const group = new ChatGroup(dto, participantProvider);
        if (dto.lastMessage) {
            const message = new ChatMessage(dto.lastMessage, userProvider);
            group.lastMessage.set(message);
        }

        return group;
    }

    addMessage(message: ChatMessage) {
        if (message.groupId === this.id) {
            this.state.messages.update(x => [...x, message]);
        }
    }

    private static createGroupParticipant(
        userProvider: Func<UserDto, User>
    ) {
        return (participantDto: GroupParticipantDto)=> GroupParticipant.create(participantDto, userProvider);
    }
}

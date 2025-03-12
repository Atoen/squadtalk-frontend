import {GroupParticipant} from "./GroupParticipant";
import {GroupId} from "../ids/GroupId";
import {ChatMessage} from "./ChatMessage";
import {GroupDto} from "../dtos/GroupDto";
import {GroupParticipantDto} from "../dtos/GroupParticipantDto";
import {GroupState} from './GroupState';
import { signal, Signal, WritableSignal } from '@angular/core';

export class ChatGroup {
    readonly participants: WritableSignal<GroupParticipant[]>;
    readonly others: WritableSignal<GroupParticipant[]>;
    readonly localUser: GroupParticipant;
    readonly id: GroupId;
    lastMessage?: ChatMessage; // TODO: create last message

    readonly state: GroupState;

    readonly messages: Signal<ChatMessage[]>;

    private constructor(
        dto: GroupDto,
        participantProvider: (participantDto: GroupParticipantDto) => GroupParticipant) {
        this.id = dto.id;

        const participants = dto.participants.map(participantProvider);

        this.participants = signal(participants);
        this.others = signal(participants.filter(x => x.user.isRemote));
        this.localUser = participants.find(x => x.user.isLocal)!;

        this.state = new GroupState(this);
        this.messages = this.state.messages.asReadonly();
    }

    addMessage(message: ChatMessage) {
        if (message.groupId === this.id) {
            this.state.messages.update(x => [...x, message]);
        }
    }
}

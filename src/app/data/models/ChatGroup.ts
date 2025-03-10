import {GroupParticipant} from "./GroupParticipant";
import {GroupId} from "../ids/GroupId";
import {ChatMessage} from "./ChatMessage";
import {GroupDto} from "../dtos/GroupDto";
import {GroupParticipantDto} from "../dtos/GroupParticipantDto";
import {GroupState} from './GroupState';
import {Signal} from '@angular/core';

export class ChatGroup {
    participants: GroupParticipant[];
    others: GroupParticipant[];
    localUser: GroupParticipant;
    id: GroupId;
    lastMessage?: ChatMessage; // TODO: create last message

    state: GroupState;

    messages: Signal<ChatMessage[]>;

    private constructor(
        dto: GroupDto,
        participantProvider: (participantDto: GroupParticipantDto) => GroupParticipant) {
        this.id = dto.id;

        this.participants = dto.participants.map(participantProvider);
        this.others = this.participants.filter(x => x.user.isRemote)
        this.localUser = this.participants.find(x => x.user.isLocal)!;

        this.state = new GroupState(this);
        this.messages = this.state.messages.asReadonly();
    }

    addMessage(message: ChatMessage) {
        if (message.groupId === this.id) {
            this.state.messages.update(x => [...x, message]);
        }
    }
}

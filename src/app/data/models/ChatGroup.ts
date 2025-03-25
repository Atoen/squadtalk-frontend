import { computed, signal, Signal, WritableSignal } from "@angular/core";
import { GroupParticipant } from "./GroupParticipant";
import { ChatMessage } from "./ChatMessage";
import { GroupId } from "../ids";
import { GroupState } from "./GroupState";
import { GroupDto, GroupParticipantDto, UserDto } from "../dtos";
import { Func } from "../../util";
import { User } from "./User";
import { ChatType } from "../enums";

export class ChatGroup {

    readonly customName: WritableSignal<string | undefined>;
    readonly participants: WritableSignal<GroupParticipant[]>;
    readonly others: WritableSignal<GroupParticipant[]>;
    readonly lastMessage: WritableSignal<ChatMessage | undefined>;
    readonly unreadMessages: WritableSignal<number>;
    readonly hasUnreadMessages: Signal<boolean>;
    readonly localUser: GroupParticipant;
    readonly id: GroupId;
    readonly type: ChatType;

    readonly state: GroupState;

    readonly messages: Signal<ChatMessage[]>;
    readonly name: Signal<string>;
    readonly unreadBadgeContent: Signal<string | null>;

    private constructor(
        dto: GroupDto,
        participantProvider: Func<GroupParticipantDto, GroupParticipant>
    ) {
        this.id = dto.id;
        this.type = dto.type;
        this.customName = signal(dto.customName);
        this.unreadMessages = signal(dto.messagesSince);
        this.hasUnreadMessages = computed(() => this.unreadMessages() > 0);

        this.lastMessage = signal<ChatMessage | undefined>(undefined);

        const participants = dto.participants.map(participantProvider);

        this.participants = signal(participants);
        this.others = signal(participants.filter(x => x.user.isRemote));
        this.localUser = participants.find(x => x.user.isLocal)!;

        this.state = new GroupState(this);
        this.messages = this.state.messages.asReadonly();

        this.name = computed(() => {
            return this.customName() ?? this.others()
                .slice(0, 3)
                .map(x => x.user.username())
                .join(', ');
        });

        this.unreadBadgeContent = computed(() => {
            const unread = this.unreadMessages();
            return unread ? (unread < 100 ? unread.toString() : "99+") : null;
        });
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
            this.lastMessage.set(message);
        }
    }

    private static createGroupParticipant(
        userProvider: Func<UserDto, User>
    ) {
        return (participantDto: GroupParticipantDto)=> GroupParticipant.create(participantDto, userProvider);
    }
}

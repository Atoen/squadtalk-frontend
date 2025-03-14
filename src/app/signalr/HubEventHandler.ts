import { Observable } from "rxjs";
import { MessageDto } from "../data/dtos/MessageDto";
import { GroupId, GroupIdPacked } from "../data/ids/GroupId";
import { HubConnection } from "@microsoft/signalr";
import { PendingFriendRequestDto } from "../data/dtos/PendingFriendRequestDto";
import { FriendRequestId } from "../data/ids/FriendRequestId";
import { FriendRequestResponseDto } from "../data/dtos/FriendRequestResponseDto";
import { UserDto } from "../data/dtos/UserDto";
import { UserId, UserIdPacked } from "../data/ids/UserId";
import { UserStatus } from "../data/enums/UserStatus";
import { unpackId } from "../data/ids/UnpackId";
import { PackedEnum } from "../data/MessagePackObject";
import { GroupDto } from "../data/dtos/GroupDto";
import { GroupRole } from "../data/enums/GroupRole";

export class HubEventHandler {

    readonly messageReceived$: Observable<MessageDto>;
    readonly userIsTyping$: Observable<{ groupId: GroupId, userId: UserId }>;
    readonly userStoppedTyping$: Observable<{ groupId: GroupId, userId: UserId }>;
    readonly addedToGroup$: Observable<GroupDto>;
    readonly groupParticipantsChanged$: Observable<GroupDto>;
    readonly participantRoleChanged$: Observable<{groupId: GroupId, userId: UserId, role: GroupRole}>;
    readonly groupDeleted$: Observable<GroupId>;
    readonly groupNameChanged$: Observable<{ groupId: GroupId; name?: string }>;

    readonly friendRequestCreated$: Observable<PendingFriendRequestDto>;
    readonly friendRequestCancelled$: Observable<FriendRequestId>;
    readonly friendRequestResponded$: Observable<FriendRequestResponseDto>;
    readonly friendAdded$: Observable<UserDto>;
    readonly friendRemoved$: Observable<UserId>;
    readonly selfStatusChanged$: Observable<UserStatus>;
    readonly friendStatusChanged$: Observable<{ friendId: UserId; status: UserStatus }>;

    constructor(private readonly connection: HubConnection) {

        //
        // Groups
        //
        this.messageReceived$ = this.createObservable('ReceivedMessage', MessageDto.unpack);

        const unpackTyping = (data: [GroupIdPacked, UserIdPacked]) => ({ groupId: unpackId(data[0]), userId: unpackId(data[1]) });
        this.userIsTyping$ = this.createObservable('UserIsTyping', unpackTyping);
        this.userStoppedTyping$ = this.createObservable('UserStoppedTyping', unpackTyping);
        this.addedToGroup$ = this.createObservable('AddedToGroup', GroupDto.unpack);
        this.groupParticipantsChanged$ = this.createObservable('GroupParticipantsChanged', GroupDto.unpack);

        const unpackParticipantRoleChanged = (data: [GroupIdPacked, UserIdPacked, PackedEnum]) => ({ groupId: unpackId(data[0]), userId: unpackId(data[1]), role: data[2] });
        this.participantRoleChanged$ = this.createObservable('ParticipantRoleChanged', unpackParticipantRoleChanged);

        const unpackGroupNameChanged = (data: [GroupIdPacked, string | undefined]) => ({ groupId: unpackId(data[0]), name: data[1] });
        this.groupNameChanged$ = this.createObservable('GroupNameChanged', unpackGroupNameChanged);
        this.groupDeleted$ = this.createObservable('GroupDeleted', unpackId);

        //
        // Friends
        //
        this.friendRequestCreated$ = this.createObservable('FriendRequestCreated', PendingFriendRequestDto.unpack);
        this.friendRequestCancelled$ = this.createObservable('FriendRequestCancelled', unpackId);
        this.friendRequestResponded$ = this.createObservable('FriendRequestResponded', FriendRequestResponseDto.unpack);
        this.friendAdded$ = this.createObservable('FriendAdded', UserDto.unpack);
        this.friendRemoved$ = this.createObservable('FriendRemoved', unpackId);
        this.selfStatusChanged$ = this.createObservable('SelfStatusChanged');

        const unpackFriendStatusChanged = (data: [UserIdPacked, PackedEnum]) => ({ friendId: unpackId(data[0]), status: data[1] })
        this.friendStatusChanged$ = this.createObservable('FriendStatusChanged', unpackFriendStatusChanged);
    }

    private createObservable<T>(
        event: string,
        transform: (...args: any[]) => T = (x) => x as T
    ): Observable<T> {
        return new Observable((observer) => {
            this.connection.on(event, (...args) => {
                try {
                    // unpack 1-element array
                    args = args.length === 1 ? args[0] : args;
                    const transformed = transform(args);

                    console.log(`Hub event ${event}:`, args, "transformed:" , transformed);

                    observer.next(transformed);
                }
                catch (e) {
                    console.error(e);
                }
            });
        });
    }
}
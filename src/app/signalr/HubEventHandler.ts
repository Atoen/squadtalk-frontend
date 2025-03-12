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

export class HubEventHandler {

    readonly messageReceived$: Observable<MessageDto>;
    readonly groupNameChanged$: Observable<{ groupId: GroupId; name?: string }>;

    readonly friendRequestCreated$: Observable<PendingFriendRequestDto>;
    readonly friendRequestCancelled$: Observable<FriendRequestId>;
    readonly friendRequestResponded$: Observable<FriendRequestResponseDto>;
    readonly friendAdded$: Observable<UserDto>;
    readonly friendRemoved$: Observable<UserId>;
    readonly friendStatusChanged$: Observable<{ friendId: UserId; status: UserStatus }>;

    constructor(connection: HubConnection) {
        this.messageReceived$ = this.createObservable<MessageDto>(connection, 'ReceivedMessage', MessageDto.unpack);

        const unpackGroupNameChanged = (data: [GroupIdPacked, string | undefined]) => ({ groupId: unpackId(data[0]), name: data[1] });
        this.groupNameChanged$ = this.createObservable<{ groupId: GroupId; name?: string }>(connection, 'GroupNameChanged', unpackGroupNameChanged);

        this.friendRequestCreated$ = this.createObservable<PendingFriendRequestDto>(connection, 'FriendRequestCreated', PendingFriendRequestDto.unpack);
        this.friendRequestCancelled$ = this.createObservable<FriendRequestId>(connection, 'FriendRequestCancelled', unpackId);
        this.friendRequestResponded$ = this.createObservable<FriendRequestResponseDto>(connection, 'FriendRequestResponded', FriendRequestResponseDto.unpack);
        this.friendAdded$ = this.createObservable<UserDto>(connection, 'FriendAdded', UserDto.unpack);
        this.friendRemoved$ = this.createObservable<UserId>(connection, 'FriendRemoved', unpackId);

        const unpackFriendStatusChanged = (data: [UserIdPacked, PackedEnum]) => ({ friendId: unpackId(data[0]), status: data[1] })
        this.friendStatusChanged$ = this.createObservable<{ friendId: UserId; status: UserStatus }>(connection, 'FriendStatusChanged', unpackFriendStatusChanged);
    }

    private createObservable<T>(
        connection: HubConnection,
        event: string,
        transform: (...args: any[]) => T = (x) => x as T
    ): Observable<T> {
        return new Observable((observer) => {
            connection.on(event, (...args) => {
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
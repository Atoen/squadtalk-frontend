import { computed, effect, Injectable, signal, untracked } from "@angular/core";
import { SignalrService } from "./SignalrService";
import { UserId } from "../data/ids/UserId";
import { User } from "../data/models/User";
import { FriendRequestId } from "../data/ids/FriendRequestId";
import { IncomingFriendRequest, OutgoingFriendRequest } from "../data/models/FriendRequest";
import { UserDto } from "../data/dtos/UserDto";
import { UserStatus } from "../data/enums/UserStatus";
import { UserAuthenticationService } from "./UserAuthenticationService";
import { PendingFriendRequestDto } from "../data/dtos/PendingFriendRequestDto";
import { FriendRequestResponseDto } from "../data/dtos/FriendRequestResponseDto";
import { HubMethodInvoker } from "../signalr/HubMethodInvoker";

@Injectable({providedIn: "root"})
export class ContactManager {

    private readonly _users = new Map<UserId, User>();
    private readonly _invoker: HubMethodInvoker;

    private readonly _friends = signal<Map<UserId, User>>(new Map());
    private readonly _incomingFriendRequests = signal<Map<FriendRequestId, IncomingFriendRequest>>(new Map());
    private readonly _outgoingFriendRequests = signal<Map<FriendRequestId, OutgoingFriendRequest>>(new Map());

    readonly friends = computed(() => [...this._friends().values()]);
    readonly incomingFriendRequests = computed(() => [...this._incomingFriendRequests().values()]);
    readonly outgoingFriendRequests = computed(() => [...this._outgoingFriendRequests().values()]);

    readonly contactsTabIndex = signal(0);

    readonly userModelProvider: (userData: UserDto) => User;
    readonly localUser: User;

    get userStatus() {
        return this.signalrService.userStatus;
    }

    constructor(
        private readonly signalrService: SignalrService,
        private readonly authService: UserAuthenticationService
    ) {
        this._invoker = signalrService.methodInvoker;

        this.userModelProvider = this.getOrCreateUser.bind(this);
        this.localUser = this.createLocalUser();

        effect(() => {
            this.localUser?.status.set(this.userStatus());
        });

        if (!signalrService.connectionCreated) return;

        const hubHandler = this.signalrService.eventHandler;
        hubHandler.friendAdded$.subscribe(friend => this.friendAdded(friend));
        hubHandler.friendRemoved$.subscribe(friendId => this.friendRemoved(friendId));
        hubHandler.friendRequestCreated$.subscribe(request => this.createdFriendRequest(request));
        hubHandler.friendRequestCancelled$.subscribe(requestId => this.friendRequestCancelled(requestId));
        hubHandler.friendRequestResponded$.subscribe(response => this.friendRequestResponded(response));
        hubHandler.friendStatusChanged$.subscribe(({ friendId, status }) => this.friendStatusChanged(friendId, status));

        this.refreshFriendList()
            .then(() => this.refreshFriendRequests());
    }

    getOrCreateUser(userData: UserDto) {
        let user = this._users.get(userData.id);
        if (!user) {
            user = new User(userData);
            this._users.set(userData.id, user);
        }

        if (userData.status !== UserStatus.Unknown) {
            user.status.set(userData.status);
        }

        return user;
    }

    async setStatus(status: UserStatus) {
        await this._invoker.setSelfStatus(status);
    }

    // async searchUser(username: string) {
    //
    // }
    //
    // async sendFriendRequest(user: User) {
    //
    // }

    async sendFriendRequest(username: string) {
        const result = await this._invoker.sendFriendRequest(username);
    }

    async respondToFriendRequest(friendRequest: IncomingFriendRequest, accepted: boolean) {
        const result = await this._invoker.respondToFriendRequest(friendRequest.id, accepted);
    }

    async cancelFriendRequest(friendRequest: OutgoingFriendRequest) {
        const result = await this._invoker.cancelFriendRequest(friendRequest.id);
    }

    async removeFriend(friend: User) {
        const result = await this._invoker.removeFriend(friend.id);
    }

    async refreshFriendList() {
        const result = await this._invoker.getFriends();
        if (result.isError) return;

        const friends = new Map(
            result.value
                .map(UserDto.unpack)
                .map(this.userModelProvider)
                .map(user => [user.id, user])
        );

        this._friends.set(friends);
    }

    async refreshFriendRequests() {
        const result = await this._invoker.getFriendRequests();
        if (result.isError) return;

        const incoming = new Map<FriendRequestId, IncomingFriendRequest>();
        const outgoing = new Map<FriendRequestId, OutgoingFriendRequest>();

        const unpacked = result.value.map(PendingFriendRequestDto.unpack);
        this.addFriendRequestToMaps(unpacked, incoming, outgoing);

        this._incomingFriendRequests.set(incoming);
        this._outgoingFriendRequests.set(outgoing);
    }

    private friendAdded(friend: UserDto) {
        this._friends.update(friends => {
            if (friends.has(friend.id)) return friends;

            const updatedFriends = new Map(friends);
            updatedFriends.set(friend.id, this.getOrCreateUser(friend));
            return updatedFriends;
        });
    }

    private friendRemoved(friendId: UserId) {
        this._friends.update(friends => {
            if (friends.delete(friendId)) {
                return new Map(friends);
            }
            return friends;
        });
    }

    private createdFriendRequest(friendRequest: PendingFriendRequestDto) {
        const incoming = new Map(this._incomingFriendRequests());
        const outgoing = new Map(this._outgoingFriendRequests());

        this.addFriendRequestToMaps([friendRequest], incoming, outgoing);

        this._incomingFriendRequests.set(incoming);
        this._outgoingFriendRequests.set(outgoing);
    }

    private friendRequestCancelled(friendRequestId: FriendRequestId) {
        this._incomingFriendRequests.update(incoming => {
            if (incoming.delete(friendRequestId)) {
                return new Map(incoming);
            }
            return incoming;
        });

        this._outgoingFriendRequests.update(outgoing => {
            if (outgoing.delete(friendRequestId)) {
                return new Map(outgoing);
            }
            return outgoing;
        });
    }

    private friendRequestResponded(response: FriendRequestResponseDto) {
        const incoming = new Map(this._incomingFriendRequests());
        const outgoing = new Map(this._outgoingFriendRequests());

        if (incoming.delete(response.friendRequestId)) {
            this._incomingFriendRequests.set(incoming);
            return;
        }

        const outgoingRequest = outgoing.get(response.friendRequestId);
        if (outgoingRequest) {
            outgoing.delete(response.friendRequestId);
            this._outgoingFriendRequests.set(outgoing);

            throw new Error(`User ${outgoingRequest.to.username()} responded ${response.accepted} to friend request`);
        }
    }

    private friendStatusChanged(friendId: UserId, status: UserStatus) {
        const friend = this._friends().get(friendId);
        if (friend) {
            friend.status.set(status);
        }
    }

    private createLocalUser() {
        const authData = untracked(this.authService.currentUser);
        if (!authData) {
            const guest = new UserDto("Guest", "", UserStatus.Unknown);
            return new User(guest, true);
        }

        const user = new User(authData, true);

        this._users.set(user.id, user);

        return user;
    }

    private addFriendRequestToMaps(
        pendingFriendRequests: PendingFriendRequestDto[],
        incoming: Map<FriendRequestId, IncomingFriendRequest>,
        outgoing: Map<FriendRequestId, OutgoingFriendRequest>
    ) {
        const currentUserId = this.authService.currentUser()?.id!;

        for (const request of pendingFriendRequests) {
            if (request.requester.id === currentUserId) {
                outgoing.set(
                    request.id,
                    new OutgoingFriendRequest(
                        this.userModelProvider(request.recipient),
                        request.createdAt,
                        request.id
                    )
                );
            } else if (request.recipient.id === currentUserId) {
                incoming.set(
                    request.id,
                    new IncomingFriendRequest(
                        this.userModelProvider(request.requester),
                        request.createdAt,
                        request.id
                    )
                );
            }
        }
    }
}
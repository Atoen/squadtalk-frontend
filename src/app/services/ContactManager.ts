import { IncomingFriendRequest, OutgoingFriendRequest, User } from "../data/models";
import { SignalrService } from "./SignalrService";
import { UserAuthenticationService } from "./UserAuthenticationService";
import { ReactiveMap } from "../data";
import { Injectable, signal, Signal, untracked } from "@angular/core";
import { FriendRequestId, UserId } from "../data/ids";
import { HubMethodInvoker } from "../signalr";
import { Func } from "../util";
import { FriendRequestResponseDto, PendingFriendRequestDto, UserDto } from "../data/dtos";
import { UserStatus } from "../data/enums";

@Injectable({providedIn: "root"})
export class ContactManager {

    private readonly _users = new Map<UserId, User>();
    private readonly _hubInvoker: HubMethodInvoker;

    private readonly _friends = new ReactiveMap<UserId, User>();
    private readonly _incomingFriendRequests = new ReactiveMap<FriendRequestId, IncomingFriendRequest>();
    private readonly _outgoingFriendRequests = new ReactiveMap<FriendRequestId, OutgoingFriendRequest>();

    readonly friends: Signal<User[]> = this._friends.values;
    readonly incomingFriendRequests = this._incomingFriendRequests.values;
    readonly outgoingFriendRequests = this._outgoingFriendRequests.values;

    readonly contactsTabIndex = signal(0);

    readonly userModelProvider: Func<UserDto, User>;
    readonly userStatus: Signal<UserStatus>;
    readonly localUser: User;

    constructor(
        private readonly authService: UserAuthenticationService,
        signalrService: SignalrService
    ) {
        this._hubInvoker = signalrService.methodInvoker;

        this.userModelProvider = this.getOrCreateUser.bind(this);
        this.localUser = this.createLocalUser();
        this.userStatus = this.localUser.status;

        if (!signalrService.connectionCreated) return;

        const hubHandler = signalrService.eventHandler;
        hubHandler.friendAdded$.subscribe(friend => this.friendAdded(friend));
        hubHandler.friendRemoved$.subscribe(friendId => this.friendRemoved(friendId));
        hubHandler.friendRequestCreated$.subscribe(request => this.createdFriendRequest(request));
        hubHandler.friendRequestCancelled$.subscribe(requestId => this.friendRequestCancelled(requestId));
        hubHandler.friendRequestResponded$.subscribe(response => this.friendRequestResponded(response));
        hubHandler.selfStatusChanged$.subscribe(status => this.localUser.status.set(status));
        hubHandler.friendStatusChanged$.subscribe(({ friendId, status }) => this.friendStatusChanged(friendId, status));

        this._hubInvoker.getSelfStatus().then(x => {
            this.localUser.status.set(x.valueOr(UserStatus.Unknown));
        })

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
        const result = await this._hubInvoker.setSelfStatus(status);
    }

    // async searchUser(username: string) {
    //
    // }
    //
    // async sendFriendRequest(user: User) {
    //
    // }

    async sendFriendRequest(username: string) {
        const result = await this._hubInvoker.sendFriendRequest(username);
    }

    async respondToFriendRequest(friendRequest: IncomingFriendRequest, accepted: boolean) {
        const result = await this._hubInvoker.respondToFriendRequest(friendRequest.id, accepted);
    }

    async cancelFriendRequest(friendRequest: OutgoingFriendRequest) {
        const result = await this._hubInvoker.cancelFriendRequest(friendRequest.id);
    }

    async removeFriend(friend: User) {
        const result = await this._hubInvoker.removeFriend(friend.id);
    }

    async refreshFriendList() {
        const result = await this._hubInvoker.getFriends();
        if (result.isError) return;

        const friends: [UserId, User][] = result.value
            .map(UserDto.unpack)
            .map(this.userModelProvider)
            .map(x => [x.id, x]);

        this._friends.refresh(friends);
    }

    async refreshFriendRequests() {
        const result = await this._hubInvoker.getFriendRequests();
        if (result.isError) return;

        const incoming = new Map<FriendRequestId, IncomingFriendRequest>();
        const outgoing = new Map<FriendRequestId, OutgoingFriendRequest>();

        const unpacked = result.value.map(PendingFriendRequestDto.unpack);
        this.addFriendRequestToMaps(unpacked, incoming, outgoing);

        this._incomingFriendRequests.addMany(incoming);
        this._outgoingFriendRequests.addMany(outgoing);
    }

    private friendAdded(friendDto: UserDto) {
        const friend = this.getOrCreateUser(friendDto);
        this._friends.add(friend.id, friend);
    }

    private friendRemoved(friendId: UserId) {
        this._friends.remove(friendId);
    }

    private createdFriendRequest(friendRequest: PendingFriendRequestDto) {
        const incoming = new Map();
        const outgoing = new Map();

        this.addFriendRequestToMaps([friendRequest], incoming, outgoing);

        this._incomingFriendRequests.addMany(incoming);
        this._outgoingFriendRequests.addMany(outgoing);
    }

    private friendRequestCancelled(friendRequestId: FriendRequestId) {
        if (!this._incomingFriendRequests.remove(friendRequestId)) {
            this._outgoingFriendRequests.remove(friendRequestId);
        }
    }

    private friendRequestResponded(response: FriendRequestResponseDto) {
        if (this._incomingFriendRequests.remove(response.friendRequestId)) {
            return;
        }

        const outgoing = this._outgoingFriendRequests.removeAndGet(response.friendRequestId);
        if (outgoing) {
            throw new Error(`User ${outgoing.to.username()} responded ${response.accepted} to friend request`);
        }
    }

    private friendStatusChanged(friendId: UserId, status: UserStatus) {
        const friend = this._friends.get(friendId);
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

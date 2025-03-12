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

@Injectable({providedIn: "root"})
export class ContactManager {

    private readonly _users = new Map<UserId, User>();

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
        this.userModelProvider = this.getOrCreateUser.bind(this);
        this.localUser = this.createLocalUser();

        effect(() => {
            this.localUser?.status.set(this.userStatus());
        });

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
        await this.signalrService.setSelfStatus(status);
    }

    async refreshFriendList() {
        const result = await this.signalrService.getFriends();
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
        const result = await this.signalrService.getFriendRequests();
        if (result.isError) return;

        this._incomingFriendRequests.set(new Map());
        this._outgoingFriendRequests.set(new Map());

        result.value
            .map(PendingFriendRequestDto.unpack)
            .forEach(x => this.addFriendRequest(x));
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

    private addFriendRequest(pendingFriendRequest: PendingFriendRequestDto) {
        const currentUserId = this.authService.currentUser()?.id!;

        if (pendingFriendRequest.requester.id === currentUserId) {
            const outgoing = new OutgoingFriendRequest(
                this.userModelProvider(pendingFriendRequest.recipient),
                pendingFriendRequest.createdAt,
                pendingFriendRequest.id
            );

            this._outgoingFriendRequests.update(x => x.set(outgoing.id, outgoing));
        }
        else if (pendingFriendRequest.recipient.id === currentUserId) {
            const incoming = new IncomingFriendRequest(
                this.userModelProvider(pendingFriendRequest.requester),
                pendingFriendRequest.createdAt,
                pendingFriendRequest.id
            );

            this._incomingFriendRequests.update(x => x.set(incoming.id, incoming));
        }
    }
}
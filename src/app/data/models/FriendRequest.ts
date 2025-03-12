import { DateTimeOffset } from "../DatetimeOffset";
import { FriendRequestId } from "../ids/FriendRequestId";
import { User } from "./User";

export abstract class FriendRequest {
    protected constructor(readonly cratedAt: DateTimeOffset, readonly id: FriendRequestId) {}
}

export class IncomingFriendRequest extends FriendRequest {
    constructor(readonly from: User, cratedAt: DateTimeOffset, id: FriendRequestId) {
        super(cratedAt, id);
    }
}

export class OutgoingFriendRequest extends FriendRequest {
    constructor(readonly to: User, cratedAt: DateTimeOffset, id: FriendRequestId) {
        super(cratedAt, id);
    }
}

import { MessagePackObject } from "../MessagePackObject";
import { FriendRequestId, FriendRequestIdPacked } from "../ids/FriendRequestId";

export type CancelFriendRequestDtoPacked = [FriendRequestIdPacked];

export class CancelFriendRequestDto implements MessagePackObject<CancelFriendRequestDtoPacked> {
    readonly packed: CancelFriendRequestDtoPacked;

    constructor(
        readonly requestId: FriendRequestId,
        packed?: CancelFriendRequestDtoPacked
    ) {
        this.packed = packed ?? [requestId.packed];
    }

    static unpack(data: CancelFriendRequestDtoPacked) {
        return new CancelFriendRequestDto(FriendRequestId.unpack(data[0]), data);
    }
}
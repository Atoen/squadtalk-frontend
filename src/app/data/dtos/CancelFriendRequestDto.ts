import { MessagePackObject } from "../MessagePackObject";
import { FriendRequestId, FriendRequestIdPacked } from "../ids/FriendRequestId";

export type CancelFriendRequestDtoPacked = [FriendRequestIdPacked];

export class CancelFriendRequestDto implements MessagePackObject<CancelFriendRequestDtoPacked> {
    readonly packed: CancelFriendRequestDtoPacked;

    constructor(
        readonly requestId: FriendRequestId,
        packed?: CancelFriendRequestDtoPacked
    ) {
        this.packed = packed ?? [[requestId]];
    }

    static unpack(data: CancelFriendRequestDtoPacked) {
        return new CancelFriendRequestDto(data[0][0], data);
    }
}
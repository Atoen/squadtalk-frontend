import { FriendRequestId, FriendRequestIdPacked } from "../ids/FriendRequestId";
import { MessagePackObject } from "../MessagePackObject";

export type FriendRequestResponseDtoPacked = [
    FriendRequestIdPacked,
    boolean
];

export class FriendRequestResponseDto implements MessagePackObject<FriendRequestResponseDtoPacked> {
    readonly packed: FriendRequestResponseDtoPacked;

    constructor(
        friendRequestId: FriendRequestId,
        accepted: boolean,
        packed?: FriendRequestResponseDtoPacked
    ) {
        this.packed = packed ?? [friendRequestId.packed, accepted];
    }

    static unpack(data: FriendRequestResponseDtoPacked) {
        return new FriendRequestResponseDto(FriendRequestId.unpack(data[0]), data[1], data);
    }
}
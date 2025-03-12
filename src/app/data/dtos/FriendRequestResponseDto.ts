import { FriendRequestId, FriendRequestIdPacked } from "../ids/FriendRequestId";
import { MessagePackObject } from "../MessagePackObject";

export type FriendRequestResponseDtoPacked = [
    FriendRequestIdPacked,
    boolean
];

export class FriendRequestResponseDto implements MessagePackObject<FriendRequestResponseDtoPacked> {
    readonly packed: FriendRequestResponseDtoPacked;

    constructor(
        readonly friendRequestId: FriendRequestId,
        readonly accepted: boolean,
        packed?: FriendRequestResponseDtoPacked
    ) {
        this.packed = packed ?? [[friendRequestId], accepted];
    }

    static unpack(data: FriendRequestResponseDtoPacked) {
        return new FriendRequestResponseDto(data[0][0], data[1], data);
    }
}
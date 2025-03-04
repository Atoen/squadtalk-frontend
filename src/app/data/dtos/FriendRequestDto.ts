import { MessagePackObject } from "../MessagePackObject";

export type FriendRequestDtoPacked = [string];

export class FriendRequestDto implements MessagePackObject<FriendRequestDtoPacked> {
    readonly packed: FriendRequestDtoPacked;

    constructor(
        readonly recipientUsername: string,
        packed?: FriendRequestDtoPacked
    ) {
        this.packed = packed ?? [recipientUsername];
    }

    static unpack(data: FriendRequestDtoPacked) {
        return new FriendRequestDto(data[0], data);
    }
}
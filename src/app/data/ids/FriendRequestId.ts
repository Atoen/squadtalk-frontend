import { MessagePackObject } from "../MessagePackObject";

export type FriendRequestIdPacked = [number];

export class FriendRequestId implements MessagePackObject<FriendRequestIdPacked> {
    readonly packed: FriendRequestIdPacked;

    constructor(readonly value: number, packed?: FriendRequestIdPacked) {
        this.packed = packed ?? [value];
    }

    static unpack(data: FriendRequestIdPacked) {
        return new FriendRequestId(data[0], data);
    }
}
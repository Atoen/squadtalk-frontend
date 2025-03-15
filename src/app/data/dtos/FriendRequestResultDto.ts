import { MessagePackObject, PackedEnum } from "../MessagePackObject";
import { PendingFriendRequestDto, PendingFriendRequestDtoPacked } from "./PendingFriendRequestDto";
import { FriendRequestResult } from "../enums";

export type FriendRequestResultDtoPacked = [
    PackedEnum,
    PendingFriendRequestDtoPacked | undefined
];

export class FriendRequestResultDto implements MessagePackObject<FriendRequestResultDtoPacked> {
    readonly packed: FriendRequestResultDtoPacked;

    constructor(
        readonly result: FriendRequestResult,
        readonly friendRequest: PendingFriendRequestDto | undefined,
        packed?: FriendRequestResultDtoPacked
    ) {
        this.packed = packed ?? [result, friendRequest?.packed]
    }

    static unpack(data: FriendRequestResultDtoPacked) {
        return new FriendRequestResultDto(
            data[0],
            data[1] ? PendingFriendRequestDto.unpack(data[1]) : undefined,
            data);
    }
}
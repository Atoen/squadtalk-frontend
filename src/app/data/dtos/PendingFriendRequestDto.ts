import { MessagePackObject } from "../MessagePackObject";
import { UserDto, UserDtoPacked } from "./UserDto";
import { FriendRequestId, FriendRequestIdPacked } from "../ids";
import { DateTimeOffset, DateTimeOffsetPacked } from "../DatetimeOffset";

export type PendingFriendRequestDtoPacked = [
    FriendRequestIdPacked,
    UserDtoPacked,
    UserDtoPacked,
    DateTimeOffsetPacked
];

export class PendingFriendRequestDto implements MessagePackObject<PendingFriendRequestDtoPacked> {
    readonly packed: PendingFriendRequestDtoPacked;

    constructor(
        readonly id: FriendRequestId,
        readonly requester: UserDto,
        readonly recipient: UserDto,
        readonly createdAt: DateTimeOffset,
        packed?: PendingFriendRequestDtoPacked
    ) {
        this.packed = packed ?? [
            [id],
            requester.packed,
            recipient.packed,
            createdAt.packed
        ];
    }

    static unpack(data: PendingFriendRequestDtoPacked) {
        return new PendingFriendRequestDto(
            data[0][0],
            UserDto.unpack(data[1]),
            UserDto.unpack(data[2]),
            DateTimeOffset.unpack(data[3]),
            data
        );
    }
}
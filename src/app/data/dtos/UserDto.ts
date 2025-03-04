import { UserId, UserIdPacked } from "../ids/UserId";
import { UserStatus } from "../enums/UserStatus";
import { MessagePackObject, PackedEnum } from "../MessagePackObject";

export type UserDtoPacked = [
    string,
    UserIdPacked,
    PackedEnum
];

export class UserDto implements MessagePackObject<UserDtoPacked> {
    readonly packed: UserDtoPacked;

    constructor(
        readonly username: string,
        readonly id: UserId,
        readonly status: UserStatus,
        packed?: UserDtoPacked
    ) {
        this.packed = packed ?? [username, id.packed, status];
    }

    static unpack(data: UserDtoPacked) {
        return new UserDto(data[0], UserId.unpack(data[1]), data[2], data);
    }
}
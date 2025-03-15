import { UserId, UserIdPacked } from "../ids";
import { UserStatus } from "../enums";
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
        this.packed = packed ?? [username, [id], status];
    }

    static unpack(data: UserDtoPacked) {
        return new UserDto(data[0], data[1][0], data[2], data);
    }
}

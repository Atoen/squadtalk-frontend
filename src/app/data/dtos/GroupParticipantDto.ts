import { UserDto, UserDtoPacked } from "./UserDto";
import { MessagePackObject, PackedEnum } from "../MessagePackObject";
import { GroupRole } from "../enums/GroupRole";

export type GroupParticipantDtoPacked = [
    UserDtoPacked,
    PackedEnum,
    UserDtoPacked
];

export class GroupParticipantDto implements MessagePackObject<GroupParticipantDtoPacked> {
    readonly packed: GroupParticipantDtoPacked;

    constructor(
        user: UserDto,
        role: GroupRole,
        addedBy: UserDto,
        packed?: GroupParticipantDtoPacked
    ) {
        this.packed = packed ?? [user.packed, role, addedBy.packed];
    }

    static unpack(data: GroupParticipantDtoPacked) {
        return new GroupParticipantDto(UserDto.unpack(data[0]), data[1], UserDto.unpack(data[2]), data)
    }
}
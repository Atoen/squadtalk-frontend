import { GroupId, GroupIdPacked } from "../ids/GroupId";
import { MessageDto, MessageDtoPacked } from "./MessageDto";
import { MessagePackObject, PackedEnum } from "../MessagePackObject";
import { GroupParticipantDto, GroupParticipantDtoPacked } from "./GroupParticipantDto";
import { ChatType } from "../enums/ChatType";

export type GroupDtoPacked = [
    GroupIdPacked,
    string | undefined,
    GroupParticipantDtoPacked[],
    MessageDtoPacked | undefined,
    number,
    PackedEnum
]

export class GroupDto implements MessagePackObject<GroupDtoPacked>{
    readonly packed: GroupDtoPacked;

    constructor(
        readonly id: GroupId,
        readonly customName: string | undefined,
        readonly participants: GroupParticipantDto[],
        readonly lastMessage: MessageDto | undefined,
        readonly messagesSince: number,
        readonly type: ChatType,
        packed?: GroupDtoPacked
    ) {
        this.packed = packed ?? [
            [id],
            customName,
            participants.map(x => x.packed),
            lastMessage?.packed,
            messagesSince,
            type
        ];
    }

    static unpack(data: GroupDtoPacked) {
        return new GroupDto(
            data[0][0],
            data[1],
            data[2].map(x => GroupParticipantDto.unpack(x)),
            data[3] ? MessageDto.unpack(data[3]) : undefined,
            data[4],
            data[5],
            data
        )
    }
}
import { MessagePackObject } from "../MessagePackObject";
import { GroupId, GroupIdPacked, MessageId, MessageIdPacked } from "../ids";
import { UserDto, UserDtoPacked } from "./UserDto";
import { DateTimeOffset, DateTimeOffsetPacked } from "../DatetimeOffset";
import { EmbedDto, EmbedDtoPacked } from "./EmbedDto";

export type MessageDtoPacked = [
    MessageIdPacked,
    UserDtoPacked,
    string,
    GroupIdPacked,
    DateTimeOffsetPacked,
    EmbedDtoPacked | undefined
];

export class MessageDto implements MessagePackObject<MessageDtoPacked> {
    readonly packed: MessageDtoPacked;

    constructor(
        readonly id: MessageId,
        readonly author: UserDto,
        readonly content: string,
        readonly groupId: GroupId,
        readonly timestamp: DateTimeOffset,
        readonly embed?: EmbedDto,
        packed?: MessageDtoPacked
    ) {
        this.packed = packed ?? [
            [id],
            author.packed,
            content,
            [groupId],
            timestamp.packed,
            embed?.packed
        ];
    }

    static unpack(data: MessageDtoPacked) {
        return new MessageDto(
            data[0][0],
            UserDto.unpack(data[1]),
            data[2],
            data[3][0],
            DateTimeOffset.unpack(data[4]),
            data[5] ? EmbedDto.unpack(data[5]) : undefined,
            data
        );
    }
}
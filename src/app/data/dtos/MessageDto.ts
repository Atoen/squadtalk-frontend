import { MessagePackObject } from "../MessagePackObject";
import { MessageId, MessageIdPacked } from "../ids/MessageId";
import { UserDto, UserDtoPacked } from "./UserDto";
import { GroupId, GroupIdPacked } from "../ids/GroupId";
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
            id.packed,
            author.packed,
            content,
            groupId.packed,
            timestamp.packed,
            embed?.packed
        ];
    }

    static unpack(data: MessageDtoPacked) {
        return new MessageDto(
            MessageId.unpack(data[0]),
            UserDto.unpack(data[1]),
            data[2],
            GroupId.unpack(data[3]),
            DateTimeOffset.unpack(data[4]),
            data[5] ? EmbedDto.unpack(data[5]) : undefined,
            data
        );
    }
}
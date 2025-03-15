import { GroupId, MessageId } from "../ids";
import { User } from "./User";
import { DateTimeOffset } from "../DatetimeOffset";
import { MessageEmbed } from "./MessageEmbed";
import { MessageDto, UserDto } from "../dtos";
import { Func } from "../../util";

export class ChatMessage {
    readonly id: MessageId;
    readonly groupId: GroupId;
    readonly author: User;
    readonly content: string;
    readonly timestamp: DateTimeOffset;
    readonly embed?: MessageEmbed;

    constructor(dto: MessageDto, userProvider: Func<UserDto, User>) {
        this.id = dto.id;
        this.groupId = dto.groupId;
        this.author = userProvider(dto.author);
        this.content = dto.content;
        this.timestamp = dto.timestamp;
        this.embed = MessageEmbed.tryCreate(dto.embed);
    }
}

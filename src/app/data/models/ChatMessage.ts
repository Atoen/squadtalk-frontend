import {MessageId} from '../ids/MessageId';
import {User} from './User';
import {DateTimeOffset} from '../DatetimeOffset';
import {MessageEmbed} from './MessageEmbed';
import {MessageDto} from '../dtos/MessageDto';
import {UserDto} from '../dtos/UserDto';
import {GroupId} from '../ids/GroupId';

export class ChatMessage {
    readonly id: MessageId;
    readonly groupId: GroupId;
    readonly author: User;
    readonly content: string;
    readonly timestamp: DateTimeOffset;
    readonly embed?: MessageEmbed;

    private constructor(dto: MessageDto, userProvider: (userDto: UserDto) => User) {
        this.id = dto.id;
        this.groupId = dto.groupId;
        this.author = userProvider(dto.author);
        this.content = dto.content;
        this.timestamp = dto.timestamp;
        this.embed = MessageEmbed.tryCreate(dto.embed);
    }
}

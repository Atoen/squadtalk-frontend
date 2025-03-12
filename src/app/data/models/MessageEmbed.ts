import {EmbedType} from '../enums/EmbedType';
import {EmbedDto} from '../dtos/EmbedDto';

export class MessageEmbed {
    readonly type: EmbedType;
    readonly data: Map<string, string>;

    private constructor(dto: EmbedDto) {
        this.type = dto.type;
        this.data = dto.data;
    }

    static tryCreate(dto?: EmbedDto) {
        return dto ? new MessageEmbed(dto) : undefined;
    }
}

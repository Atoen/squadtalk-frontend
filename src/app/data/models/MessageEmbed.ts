import {EmbedType} from '../enums/EmbedType';
import {EmbedDto} from '../dtos/EmbedDto';

export class MessageEmbed {
    type: EmbedType;
    data: Map<string, string>;

    private constructor(dto: EmbedDto) {
        this.type = dto.type;
        this.data = dto.data;
    }

    static tryCreate(dto?: EmbedDto) {
        return dto ? new MessageEmbed(dto) : undefined;
    }
}

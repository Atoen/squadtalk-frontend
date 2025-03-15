import { EmbedType } from '../enums';
import { EmbedDto } from '../dtos';

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

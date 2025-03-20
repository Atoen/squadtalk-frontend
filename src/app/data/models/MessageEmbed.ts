import { EmbedType } from '../enums';
import { EmbedDto } from '../dtos';

export class MessageEmbed {
    readonly type: EmbedType;
    readonly data: Map<string, string>;

    constructor(dto: EmbedDto) {
        this.type = dto.type;
        this.data = new Map(Object.entries(dto.data));
    }

    get(key: string) {
        return this.data.get(key);
    }

    static tryCreate(dto?: EmbedDto) {
        return dto ? new MessageEmbed(dto) : undefined;
    }
}

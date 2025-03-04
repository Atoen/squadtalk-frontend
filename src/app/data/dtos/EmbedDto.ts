import { MessagePackObject, PackedEnum } from "../MessagePackObject";
import { EmbedType } from "../enums/EmbedType";

export type EmbedDtoPacked = [
    PackedEnum,
    Map<string, string>
];

export class EmbedDto implements MessagePackObject<EmbedDtoPacked> {
    readonly packed: EmbedDtoPacked;

    constructor(
        readonly type: EmbedType,
        readonly data: Map<string, string>,
        packed?: EmbedDtoPacked
    ) {
        this.packed = packed ?? [type, data];
    }

    static unpack(data: EmbedDtoPacked) {
        return new EmbedDto(data[0], data[1], data);
    }
}
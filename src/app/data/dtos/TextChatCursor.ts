import { MessageId, MessageIdPacked, unpackId } from "@data/ids";
import { MessagePackObject } from "@data/MessagePackObject";

export type TextChatCursorPacked = [MessageIdPacked];

export class TextChatCursor implements MessagePackObject<TextChatCursorPacked> {
    readonly packed: TextChatCursorPacked;

    static readonly default = new TextChatCursor(0);

    constructor(readonly value: MessageId, packed?: TextChatCursorPacked) {
        this.packed = packed ?? [[value]];
    }

    static unpack(data: TextChatCursorPacked) {
        return new TextChatCursor(unpackId(data[0]), data);
    }
}
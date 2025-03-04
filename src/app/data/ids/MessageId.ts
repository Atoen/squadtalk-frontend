import { MessagePackObject } from "../MessagePackObject";

export type MessageIdPacked = [number];

export class MessageId implements MessagePackObject<MessageIdPacked> {
    readonly packed: MessageIdPacked;

    constructor(readonly value: number, packed?: MessageIdPacked) {
        this.packed = packed ?? [value];
    }

    static unpack(data: MessageIdPacked) {
        return new MessageId(data[0], data);
    }
}
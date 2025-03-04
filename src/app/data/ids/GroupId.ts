import { MessagePackObject } from "../MessagePackObject";

export type GroupIdPacked = [string];

export class GroupId implements MessagePackObject<GroupIdPacked> {
    readonly packed: GroupIdPacked;

    static readonly GlobalChatId: GroupId = new GroupId('global');

    constructor(readonly value: string, data?: GroupIdPacked) {
        this.packed = data ?? [value];
    }

    static unpack(data: GroupIdPacked) {
        return new GroupId(data[0], data);
    }
}
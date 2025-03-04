import { MessagePackObject } from "../MessagePackObject";

export type UserIdPacked = [string];

export class UserId implements MessagePackObject<UserIdPacked> {
    readonly packed: UserIdPacked;

    constructor(readonly value: string, packed?: UserIdPacked) {
        this.packed = packed ?? [value];
    }

    static unpack(data: UserIdPacked) {
        return new UserId(data[0], data);
    }
}
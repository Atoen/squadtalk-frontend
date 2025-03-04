import { UserId, UserIdPacked } from "../ids/UserId";
import { MessagePackObject } from "../MessagePackObject";

export type RemoveFriendDtoPacked = [UserIdPacked];

export class RemoveFriendDto implements MessagePackObject<RemoveFriendDtoPacked> {
    readonly packed: RemoveFriendDtoPacked;

    constructor(
        readonly friendId: UserId,
        packed?: RemoveFriendDtoPacked
    ) {
        this.packed = packed ?? [friendId.packed];
    }

    static unpack(data: RemoveFriendDtoPacked) {
        return new RemoveFriendDto(UserId.unpack(data[0]), data);
    }
}
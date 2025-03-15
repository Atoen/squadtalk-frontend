import { UserId, UserIdPacked } from "../ids";
import { MessagePackObject } from "../MessagePackObject";

export type RemoveFriendDtoPacked = [UserIdPacked];

export class RemoveFriendDto implements MessagePackObject<RemoveFriendDtoPacked> {
    readonly packed: RemoveFriendDtoPacked;

    constructor(
        readonly friendId: UserId,
        packed?: RemoveFriendDtoPacked
    ) {
        this.packed = packed ?? [[friendId]];
    }

    static unpack(data: RemoveFriendDtoPacked) {
        return new RemoveFriendDto(data[0][0], data);
    }
}
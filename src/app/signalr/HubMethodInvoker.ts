import { UserStatus } from "../data/enums/UserStatus";
import { UserDtoPacked } from "../data/dtos/UserDto";
import { GroupDtoPacked } from "../data/dtos/GroupDto";
import { PendingFriendRequestDtoPacked } from "../data/dtos/PendingFriendRequestDto";
import { FriendRequestDto } from "../data/dtos/FriendRequestDto";
import { FriendRequestResult } from "../data/enums/FriendRequestResult";
import { FriendRequestId } from "../data/ids/FriendRequestId";
import { CancelFriendRequestDto } from "../data/dtos/CancelFriendRequestDto";
import { FriendRequestResponseDto } from "../data/dtos/FriendRequestResponseDto";
import { FriendRequestResponseResult } from "../data/enums/FriendRequestResponseResult";
import { UserId } from "../data/ids/UserId";
import { RemoveFriendDto } from "../data/dtos/RemoveFriendDto";
import { RemoveFriendResult } from "../data/enums/RemoveFriendResult";
import { ConnectionMethodInvoker } from "./ConnectionMethodInvoker";

export class HubMethodInvoker {

    constructor(private readonly methodInvoker: ConnectionMethodInvoker) {}

    getSelfStatus() {
        return this.methodInvoker.invoke<UserStatus>('GetSelfStatus');
    }

    setSelfStatus(status: UserStatus) {
        return this.methodInvoker.send('ChangeStatus', status);
    }

    getFriends() {
        return this.methodInvoker.invoke<UserDtoPacked[]>('GetFriendList');
    }

    getGroups() {
        return this.methodInvoker.invoke<GroupDtoPacked[]>('GetGroups');
    }

    getFriendRequests() {
        return this.methodInvoker.invoke<PendingFriendRequestDtoPacked[]>('GetFriendRequests');
    }

    sendFriendRequest(recipientUsername: string) {
        const data = new FriendRequestDto(recipientUsername);
        return this.methodInvoker.invoke<FriendRequestResult>('SendFriendRequest', data.packed);
    }

    cancelFriendRequest(requestId: FriendRequestId) {
        const data = new CancelFriendRequestDto(requestId);
        return this.methodInvoker.invoke<boolean>('CancelFriendRequest', data.packed);
    }

    respondToFriendRequest(requestId: FriendRequestId, isAccepted: boolean) {
        const data = new FriendRequestResponseDto(requestId, isAccepted);
        return this.methodInvoker.invoke<FriendRequestResponseResult>('RespondToFriendRequest', data.packed);
    }

    removeFriend(friendId: UserId) {
        const data = new RemoveFriendDto(friendId);
        return this.methodInvoker.invoke<RemoveFriendResult>('RemoveFriend', data.packed);
    }
}
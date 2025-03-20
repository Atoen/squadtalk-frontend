import {
    CancelFriendRequestDto,
    FriendRequestDto, FriendRequestResponseDto,
    GroupDtoPacked, MessageDtoPacked,
    PendingFriendRequestDtoPacked, RemoveFriendDto,
    UserDtoPacked
} from "@data/dtos";
import { FriendRequestResponseResult, FriendRequestResult, RemoveFriendResult, UserStatus } from "@data/enums";
import { ConnectionMethodInvoker } from "./ConnectionMethodInvoker";
import { FriendRequestId, GroupId, UserId } from "@data/ids";
import { TextChatCursor } from "@dtos/TextChatCursor";

export class HubMethodInvoker {

    constructor(private readonly methodInvoker: ConnectionMethodInvoker) {}

    getSelfStatus() {
        return this.methodInvoker.invoke<UserStatus>('GetSelfStatus');
    }

    setSelfStatus(status: UserStatus) {
        return this.methodInvoker.send('ChangeStatus', status);
    }

    sendMessage(message: string, groupId: GroupId) {
        return this.methodInvoker.send('SendMessage', message, [groupId]);
    }

    getMessagePage(groupId: GroupId, cursor: TextChatCursor = TextChatCursor.default) {
        return this.methodInvoker.invoke<MessageDtoPacked[]>('GetMessagePage', [groupId], cursor.packed);
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
export enum FriendRequestResult
{
    Error = -1,
    Success = 0,
    RecipientNotFound,
    SelfRequest,
    RequestAlreadyPending,
    AlreadyFriends,
}
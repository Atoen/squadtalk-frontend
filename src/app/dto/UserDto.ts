export interface UserDto {
    username: string;
    id: UserId;
    status: UserStatus;
}

export interface UserId {
    value: string;
}

export enum UserStatus {
    Unknown = 'Unknown',
    Online = 'Online',
    Away = 'Away',
    DoNotDisturb = 'DoNotDisturb',
    Offline = 'Offline'
}

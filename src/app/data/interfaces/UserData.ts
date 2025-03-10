import {UserStatus} from '../enums/UserStatus';
import {UserId} from '../ids/UserId';

export interface UserData {
    username: string;
    status: UserStatus;
    id: UserId;
}

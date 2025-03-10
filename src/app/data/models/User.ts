import {UserStatus} from '../enums/UserStatus';
import {UserId} from '../ids/UserId';
import {UserDto} from '../dtos/UserDto';
import { UserData } from '../interfaces/UserData';

export class User implements UserData {
    username: string;
    status: UserStatus;
    id: UserId;
    isLocal: boolean;

    get isRemote() {
        return !this.isLocal;
    }

    constructor(dto: UserDto, isLocal: boolean = false) {
        this.username = dto.username;
        this.status = dto.status;
        this.id = dto.id;

        this.isLocal = isLocal;
    }
}

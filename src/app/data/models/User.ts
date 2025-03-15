import { UserStatus } from '../enums';
import { UserId } from '../ids';
import { UserDto } from '../dtos';

import { signal, WritableSignal } from "@angular/core";

export class User {

    username: WritableSignal<string>;
    status: WritableSignal<UserStatus>;

    readonly id: UserId;
    readonly isLocal: boolean;

    get isRemote() {
        return !this.isLocal;
    }

    constructor(dto: UserDto, isLocal: boolean = false) {
        this.username = signal(dto.username);
        this.status = signal(dto.status);
        this.id = dto.id;

        this.isLocal = isLocal;
    }
}

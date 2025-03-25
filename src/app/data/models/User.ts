import { UserStatus } from '../enums';
import { UserId } from '../ids';
import { computed, Signal, signal, WritableSignal } from "@angular/core";
import { UserDto } from '../dtos';

export class User {

    username: WritableSignal<string>;
    status: WritableSignal<UserStatus>;

    isActive: Signal<boolean>;

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

        this.isActive = computed(() => {
            const status = this.status();
            return status !== UserStatus.Offline && status !== UserStatus.Unknown;
        })
    }
}

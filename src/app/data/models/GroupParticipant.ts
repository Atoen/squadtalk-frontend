import {User} from './User';
import {GroupRole} from '../enums/GroupRole';
import {GroupParticipantDto} from '../dtos/GroupParticipantDto';
import {UserDto} from '../dtos/UserDto';
import { signal, WritableSignal } from "@angular/core";

export class GroupParticipant {
    readonly user: User;
    readonly addedBy: User;

    readonly role: WritableSignal<GroupRole>;

    private constructor(dto: GroupParticipantDto, userProvider: (userDto: UserDto) => User) {
        this.user = userProvider(dto.user);
        this.addedBy = userProvider(dto.addedBy);
        this.role = signal(dto.role);
    }
}

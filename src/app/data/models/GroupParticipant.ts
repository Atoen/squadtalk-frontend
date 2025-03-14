import {User} from './User';
import {GroupRole} from '../enums/GroupRole';
import {GroupParticipantDto} from '../dtos/GroupParticipantDto';
import {UserDto} from '../dtos/UserDto';
import { signal, WritableSignal } from "@angular/core";
import { Func } from "../../util/Delegate";

export class GroupParticipant {
    readonly user: User;
    readonly addedBy: User;

    readonly role: WritableSignal<GroupRole>;

    private constructor(dto: GroupParticipantDto, userProvider: Func<UserDto, User>) {
        this.user = userProvider(dto.user);
        this.addedBy = userProvider(dto.addedBy);
        this.role = signal(dto.role);
    }

    static create(dto: GroupParticipantDto, userProvider: Func<UserDto, User>) {
        return new GroupParticipant(dto, userProvider);
    }
}

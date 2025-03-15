import { GroupParticipantDto, UserDto } from "../dtos";
import { User } from "./User";
import { signal, WritableSignal } from "@angular/core";
import { GroupRole } from "../enums";
import { Func } from "../../util";

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

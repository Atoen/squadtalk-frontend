import { GroupParticipantDto, UserDto } from "../dtos";
import { User } from "./User";
import { computed, Signal, signal, WritableSignal } from "@angular/core";
import { GroupRole } from "../enums";
import { Func } from "../../util";

export class GroupParticipant {
    readonly user: User;
    readonly addedBy: User;

    readonly role: WritableSignal<GroupRole>;
    readonly isModeratorOrAbove: Signal<boolean>;

    get id() {
        return this.user.id;
    }

    private constructor(dto: GroupParticipantDto, userProvider: Func<UserDto, User>) {
        this.user = userProvider(dto.user);
        this.addedBy = userProvider(dto.addedBy);

        this.role = signal(dto.role);
        this.isModeratorOrAbove = computed(() => this.role() >= GroupRole.Moderator);
    }

    static create(dto: GroupParticipantDto, userProvider: Func<UserDto, User>) {
        return new GroupParticipant(dto, userProvider);
    }
}

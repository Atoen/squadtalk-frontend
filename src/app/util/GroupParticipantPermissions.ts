import { GroupParticipant } from "@data/models";
import { GroupRole } from "@data/enums";
import { untracked } from "@angular/core";

export class GroupRolePermissions {
    static canAddNewMembers(participant: GroupParticipant): boolean {
        return true;
    }

    static canChangeGroupNameAndImage(participant: GroupParticipant): boolean {
        return untracked(participant.role) >= GroupRole.Moderator;
    }

    static canKick(participant: GroupParticipant, other: GroupParticipant): boolean {
        return untracked(participant.role) > untracked(other.role);
    }

    static canManageRole(participant: GroupParticipant, other: GroupParticipant): boolean {
        return untracked(participant.role) > GroupRole.Moderator && untracked(participant.role) > untracked(other.role);
    }

    static isModeratorOrAbove(participant: GroupParticipant): boolean {
        return participant.isModeratorOrAbove();
    }

    static canAddModerators(participant: GroupParticipant): boolean {
        return untracked(participant.role) >= GroupRole.Administrator;
    }

    static canAddAdministrators(participant: GroupParticipant): boolean {
        return untracked(participant.role) === GroupRole.Owner;
    }

    static canDeleteGroup(participant: GroupParticipant): boolean {
        return untracked(participant.role) === GroupRole.Owner;
    }

    static canChangeRoleTo(participant: GroupParticipant, other: GroupParticipant, targetRole: GroupRole): boolean {
        const participantRole = untracked(participant.role);
        const otherRole = untracked(other.role);

        if (otherRole === targetRole) {
            return false;
        }

        if (participantRole === GroupRole.Administrator && targetRole <= GroupRole.Moderator) {
            return true;
        }

        if (participantRole === GroupRole.Owner && targetRole <= GroupRole.Administrator) {
            return true;
        }

        return false;
    }
}

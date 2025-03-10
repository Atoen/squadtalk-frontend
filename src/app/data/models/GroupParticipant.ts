import {User} from './User';
import {GroupRole} from '../enums/GroupRole';
import {GroupParticipantDto} from '../dtos/GroupParticipantDto';
import {UserDto} from '../dtos/UserDto';

export class GroupParticipant {
    user: User;
    role: GroupRole;
    addedBy: User;

    private constructor(dto: GroupParticipantDto, userProvider: (userDto: UserDto) => User) {
        this.user = userProvider(dto.user);
        this.addedBy = userProvider(dto.addedBy);
        this.role = dto.role;
    }
}

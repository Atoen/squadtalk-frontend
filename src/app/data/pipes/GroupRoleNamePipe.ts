import { inject, Pipe, PipeTransform } from "@angular/core";
import { GroupRole } from "@data/enums";
import { TranslateService } from "@ngx-translate/core";

@Pipe({ name: 'groupRoleName' })
export class GroupRoleNamePipe implements PipeTransform {

    private readonly translateService = inject(TranslateService);

    transform(role: GroupRole) {
        switch (role) {
            case GroupRole.Member:
                return this.translateService.instant('group_role.member');
            case GroupRole.Moderator:
                return this.translateService.instant('group_role.moderator');
            case GroupRole.Administrator:
                return this.translateService.instant('group_role.admin');
            case GroupRole.Owner:
                return this.translateService.instant('status.creator');
        }
    }
}
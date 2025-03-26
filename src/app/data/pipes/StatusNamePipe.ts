import { inject, Pipe, PipeTransform } from "@angular/core";
import { UserStatus } from "@data/enums";
import { TranslateService } from "@ngx-translate/core";

@Pipe({ name: 'statusName' })
export class StatusNamePipe implements PipeTransform {

    private readonly translateService = inject(TranslateService);

    transform(status: UserStatus) {
        switch (status) {
            case UserStatus.Unknown:
                return this.translateService.instant('status.unknown');

            case UserStatus.Online:
                return this.translateService.instant('status.online');

            case UserStatus.Away:
                return this.translateService.instant('status.away');

            case UserStatus.DoNotDisturb:
                return this.translateService.instant('status.do_not_disturb');

            case UserStatus.Offline:
                return this.translateService.instant('status.offline');
        }
    }
}

@Pipe({ name: 'selfStatusName', pure: false })
export class SelfStatusNamePipe implements PipeTransform {

    private readonly translateService = inject(TranslateService);

    transform(status: UserStatus) {
        switch (status) {
            case UserStatus.Unknown:
                return this.translateService.instant('loading');

            case UserStatus.Online:
                return this.translateService.instant('status.online');

            case UserStatus.Away:
                return this.translateService.instant('status.away');

            case UserStatus.DoNotDisturb:
                return this.translateService.instant('status.do_not_disturb');

            case UserStatus.Offline:
                return  this.translateService.instant('status.hidden');
        }
    }
}

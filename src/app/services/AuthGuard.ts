import { inject, Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    GuardResult,
    MaybeAsync,
    RedirectCommand,
    Router,
    RouterStateSnapshot
} from '@angular/router';
import { ProfileService } from './ProfileService';

@Injectable({providedIn: "root"})
export class AuthGuard implements CanActivate {

    private router = inject(Router);
    private profileService = inject(ProfileService);

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): MaybeAsync<GuardResult> {
        if (!this.profileService.isLoggedIn) {
            const loginUrl = this.router.createUrlTree(['/profile/login'], {
                queryParams: { returnUrl: state.url }
            });

            return new RedirectCommand(loginUrl);
        }

        return true;
    }
}

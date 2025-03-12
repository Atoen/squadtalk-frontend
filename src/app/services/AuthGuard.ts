import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    GuardResult,
    MaybeAsync,
    RedirectCommand,
    Router,
    RouterStateSnapshot
} from '@angular/router';
import { UserAuthenticationService } from './UserAuthenticationService';
import { isPlatformBrowser } from '@angular/common';

@Injectable({providedIn: "root"})
export class AuthGuard implements CanActivate {

    private router = inject(Router);
    private platformId = inject(PLATFORM_ID);
    private authService = inject(UserAuthenticationService);

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): MaybeAsync<GuardResult> {
        if (!this.authService.isLoggedIn()) {

            const redirectUrl = isPlatformBrowser(this.platformId)
                ? '/profile/login' : '/';

            const redirectUrlTree = this.router.createUrlTree([redirectUrl], {
                queryParams: { returnUrl: state.url },
                queryParamsHandling: 'merge'
            });

            return new RedirectCommand(redirectUrlTree);
        }

        return true;
    }
}

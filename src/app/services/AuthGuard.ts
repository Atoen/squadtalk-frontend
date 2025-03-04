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
import { AuthenticationState, UserAuthenticationService } from './UserAuthenticationService';

@Injectable({providedIn: "root"})
export class AuthGuard implements CanActivate {

    private router = inject(Router);
    private authService = inject(UserAuthenticationService);

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): MaybeAsync<GuardResult> {
        if (!this.authService.isLoggedIn()) {
            const loginUrl = this.router.createUrlTree(['/profile/login'], {
                queryParams: { returnUrl: state.url },
                queryParamsHandling: 'merge'
            });

            return new RedirectCommand(loginUrl);
        }

        return true;
    }
}

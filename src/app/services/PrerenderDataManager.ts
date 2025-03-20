import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { filter, map, Subject, take, takeUntil, tap, timer } from "rxjs";
import { isPlatformBrowser } from "@angular/common";
import { UserAuthenticationService } from "@services/UserAuthenticationService";

@Injectable({providedIn: "root"})
export class PrerenderDataManager {

    // Assigned by reverse proxy. Manually set args are discarded.
    private static readonly preferencesArg = 'p';
    private static readonly usernameArg = 'u';

    private readonly preferencesDataSubject = new Subject<string>();

    readonly preferencesData$ = this.preferencesDataSubject.asObservable();

    constructor(
        private readonly route: ActivatedRoute,
        @Inject(PLATFORM_ID) platformId: Object,
        authService: UserAuthenticationService
    ) {
        if (isPlatformBrowser(platformId)) {
            this.preferencesDataSubject.complete();
            return;
        }

        this.route.queryParams
            .pipe(
                map(PrerenderDataManager.readQuery),
                filter(data => !!data),
                take(1),
                takeUntil(timer(500)),
                tap(data => console.log('Query data:', data))
            ).subscribe(({ preferences, username }) => {
                if (preferences) this.preferencesDataSubject.next(preferences);
                if (username) authService.setPrerender(username);
                this.preferencesDataSubject.complete();
            });
    }

    private static readQuery(query: Params): QueryData | undefined {
        const preferences = query[PrerenderDataManager.preferencesArg];
        const username = query[PrerenderDataManager.usernameArg];

        if (preferences || username) {
            return { preferences, username };
        }

        return undefined;
    }
}

interface QueryData {
    preferences?: string;
    username?: string;
}
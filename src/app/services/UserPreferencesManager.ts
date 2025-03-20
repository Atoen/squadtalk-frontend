import { computed, DestroyRef, effect, Inject, Injectable, PLATFORM_ID, signal, untracked } from "@angular/core";
import { ApplicationLanguage } from "@data/preferences/ApplicationLanguage";
import { ApplicationTheme } from "@data/preferences/ApplicationTheme";
import { DOCUMENT, isPlatformServer } from "@angular/common";
import { ApplicationPreferences } from "@data/preferences/ApplicationPreferences";
import { TranslateService } from "@ngx-translate/core";
import { PrerenderDataManager } from "@services/PrerenderDataManager";

@Injectable({providedIn: "root"})
export class UserPreferencesManager {

    private readonly html: HTMLElement;
    private readonly preferences = signal(ApplicationPreferences.default);

    readonly language = computed(() => this.preferences().language());
    readonly theme = computed(() => this.preferences().theme());

    constructor(
        private readonly translateService: TranslateService,
        @Inject(PLATFORM_ID) private readonly platformId: Object,
        @Inject(DestroyRef) destroyRef: DestroyRef,
        @Inject(DOCUMENT) document: Document,
        prerenderDataManager: PrerenderDataManager
    ) {

        if (isPlatformServer(platformId)) {
            prerenderDataManager.preferencesData$.subscribe(data => {
                const parsed = ApplicationPreferences.parse(data);
                this.preferences.set(parsed);
            });
        } else {
            const data = this.readCookie();
            const parsed = ApplicationPreferences.parse(data);
            this.preferences.set(parsed);
        }

        const languageEffect = effect(() => this.translateService.use(this.language().tag));
        const themeEffect = effect(() => this.updateThemeClass(this.theme()));

        destroyRef.onDestroy(() => {
            languageEffect.destroy();
            themeEffect.destroy();
        });

        this.translateService.addLangs(['en', 'pl']);
        this.translateService.setDefaultLang('en');

        this.html = document.documentElement;
    }

    changeLanguage(language: ApplicationLanguage) {
        untracked(this.preferences).language.set(language);
        this.translateService.use(language.tag);

        this.savePreferences();
    }

    changeTheme(theme: ApplicationTheme) {
        untracked(this.preferences).theme.set(theme);

        this.savePreferences();
    }

    private updateThemeClass(theme: ApplicationTheme) {
        if (theme === ApplicationTheme.Light) {
            this.html.classList.remove('app-dark');
        } else {
            this.html.classList.add('app-dark');
        }
    }

    private readCookie() {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ap=`, 2);
        if (parts.length === 2) {
            return parts.pop()?.split(';').shift();
        }

        return undefined;
    }

    private savePreferences() {
        if (isPlatformServer(this.platformId)) return;

        const serialized = untracked(this.preferences).serialize();
        document.cookie = `ap=${serialized}; path=/; Max-Age=31536000; SameSite=Strict`;
    }
}
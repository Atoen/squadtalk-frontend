import { ApplicationConfig, ErrorHandler, Injectable, provideZoneChangeDetection } from '@angular/core';
import {provideRouter, RouterStateSnapshot, TitleStrategy} from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, Title, withEventReplay } from '@angular/platform-browser';
import { providePrimeNG } from 'primeng/config';
import Material from '@primeng/themes/material';
import { provideNgIconsConfig } from '@ng-icons/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { ToastErrorHandler } from "./services";
import { MessageService } from "primeng/api";
import {provideTranslateService} from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class TemplatePageTitleStrategy extends TitleStrategy {
    constructor(private readonly title: Title) {
        super();
    }

    override updateTitle(routerState: RouterStateSnapshot) {
        const title = this.buildTitle(routerState);
        if (title !== undefined) {
            this.title.setTitle(`Squadtalk | ${title}`);
        } else {
            this.title.setTitle('Squadtalk');
        }
    }
}

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes),
        { provide: TitleStrategy, useClass: TemplatePageTitleStrategy },
        provideClientHydration(withEventReplay()),
        provideAnimationsAsync(),
        providePrimeNG({
            theme: {
                preset: Material,
                options: {
                    darkModeSelector: '.app-dark'
                }
            },
            ripple: true
        }),
        provideNgIconsConfig({
            size: '1.5em'
        }),
        provideHttpClient(withFetch()),
        MessageService,
        { provide: ErrorHandler, useClass: ToastErrorHandler },
        provideTranslateService({
            defaultLanguage: 'en'
        })
    ]
};

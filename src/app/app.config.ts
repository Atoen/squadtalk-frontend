import {
    ApplicationConfig,
    ErrorHandler,
    importProvidersFrom,
    Injectable,
    provideExperimentalZonelessChangeDetection
} from '@angular/core';
import { provideRouter, RouterStateSnapshot, TitleStrategy, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, Title, withEventReplay } from '@angular/platform-browser';
import { providePrimeNG } from 'primeng/config';
import Material from '@primeng/themes/material';
import { provideNgIconsConfig } from '@ng-icons/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { ToastErrorHandler } from "./services";
import { ConfirmationService, MessageService } from "primeng/api";
import { provideTranslateService, TranslateCompiler, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { StaticTranslationsLoader } from "./StaticTranslationsLoader";
import { DialogService } from "primeng/dynamicdialog";
import { TranslateMessageFormatCompiler } from "ngx-translate-messageformat-compiler";

@Injectable({ providedIn: 'root' })
export class TemplatePageTitleStrategy extends TitleStrategy {
    constructor(
        private readonly title: Title,
    ) {
        super();
    }

    override updateTitle(routerState: RouterStateSnapshot) {
        const title = this.buildTitle(routerState);
        if (title) {
            this.title.setTitle(`Squadtalk | ${title}`);
        } else {
            this.title.setTitle('Squadtalk');
        }
    }
}

export const appConfig: ApplicationConfig = {
    providers: [
        provideExperimentalZonelessChangeDetection(),
        provideRouter(routes, withComponentInputBinding()),
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
        MessageService, DialogService, ConfirmationService,
        { provide: ErrorHandler, useClass: ToastErrorHandler },
        provideTranslateService({
            defaultLanguage: 'en'
        }),
        importProvidersFrom([TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useClass: StaticTranslationsLoader
            },
            compiler: {
                provide: TranslateCompiler,
                useClass: TranslateMessageFormatCompiler
            }
        })])
    ]
};

import { TranslateLoader, Translation, TranslationObject } from "@ngx-translate/core";
import { Observable, of } from "rxjs";

import * as TranslationsEN from '../../public/i18n/generated/en.json';
import * as TranslationsPL from '../../public/i18n/generated/pl.json';

const TRANSLATIONS: Translation = {
    en: TranslationsEN,
    pl: TranslationsPL
};

export class StaticTranslationsLoader implements TranslateLoader {
    getTranslation(lang: string): Observable<TranslationObject> {
        const translation = TRANSLATIONS[lang];
        if (translation) {
            return of(translation);
        } else {
            console.error(`Unknown language: ${lang}`);
            return of({});
        }
    }
}
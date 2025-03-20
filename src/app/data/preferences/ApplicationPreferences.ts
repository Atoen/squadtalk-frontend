import { signal, untracked, WritableSignal } from "@angular/core";
import { ApplicationLanguage } from "@data/preferences/ApplicationLanguage";
import { ApplicationTheme } from "@data/preferences/ApplicationTheme";

export class ApplicationPreferences {

    private static readonly dataDelimiter = '$';

    readonly language: WritableSignal<ApplicationLanguage>;
    readonly theme: WritableSignal<ApplicationTheme>;

    constructor(language: ApplicationLanguage, theme: ApplicationTheme) {
        this.language = signal(language);
        this.theme = signal(theme);
    }

    static readonly default = new ApplicationPreferences(
        ApplicationLanguage.Default,
        ApplicationTheme.Default
    );

    static parse(data?: string) {
        if (!data) {
            return ApplicationPreferences.default;
        }

        const parts = data.split(ApplicationPreferences.dataDelimiter, 4);

        const language = ApplicationLanguage.parseLanguageCode(parts[0]);
        const theme = ApplicationTheme.parseTheme(parts[1]);
        const themeAutoValue = parts[2];
        const scheme = parts[3];

        return new ApplicationPreferences(language, theme);
    }

    serialize() {
        const language = untracked(this.language);
        const theme = untracked(this.theme);

        const delimiter = ApplicationPreferences.dataDelimiter;
        return `${language.tag}${delimiter}${theme.tag}`;
    }
}

export class ApplicationLanguage {
    private static readonly EnglishTag = "en";
    private static readonly PolishTag = "pl";

    static readonly English = new ApplicationLanguage(ApplicationLanguage.EnglishTag);
    static readonly Polish = new ApplicationLanguage(ApplicationLanguage.PolishTag);

    static readonly Default = ApplicationLanguage.English;

    readonly cultureInfo: Intl.Locale;

    private constructor(readonly tag: string) {
        this.cultureInfo = new Intl.Locale(tag);
    }

    static parseLanguageCode(languageCode?: string): ApplicationLanguage {
        switch (languageCode) {
            case ApplicationLanguage.EnglishTag:
                return ApplicationLanguage.English;
            case ApplicationLanguage.PolishTag:
                return ApplicationLanguage.Polish;
            default:
                return ApplicationLanguage.Default;
        }
    }
}

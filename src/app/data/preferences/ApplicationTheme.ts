export class ApplicationTheme {
    private static readonly LightTag = "light";
    private static readonly DarkTag = "dark";
    private static readonly AutoTag = "auto";

    static readonly Light = new ApplicationTheme(ApplicationTheme.LightTag);
    static readonly Dark = new ApplicationTheme(ApplicationTheme.DarkTag);
    static readonly Auto = new ApplicationTheme(ApplicationTheme.AutoTag);

    static readonly Default = ApplicationTheme.Light;

    private constructor(readonly tag: string) {}

    static parseTheme(theme?: string): ApplicationTheme {
        switch (theme) {
            case ApplicationTheme.LightTag:
                return ApplicationTheme.Light;
            case ApplicationTheme.DarkTag:
                return ApplicationTheme.Dark;
            case ApplicationTheme.AutoTag:
                return ApplicationTheme.Auto;
            default:
                return ApplicationTheme.Default
        }
    }
}

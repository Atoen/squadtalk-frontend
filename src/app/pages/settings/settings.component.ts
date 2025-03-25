import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Button } from 'primeng/button';
import { MenuItem } from "primeng/api";
import { TranslatePipe, TranslateService } from "@ngx-translate/core";
import { Menu } from "primeng/menu";
import { UserPreferencesManager } from "@services/UserPreferencesManager";
import { ApplicationLanguage } from "@data/preferences/ApplicationLanguage";
import { ApplicationTheme } from "@data/preferences/ApplicationTheme";
import { marker as _ } from '@colsen1991/ngx-translate-extract-marker';
import { Subscription } from "rxjs";

@Component({
    selector: 'app-settings',
    imports: [
        Button,
        Menu,
        TranslatePipe
    ],
    templateUrl: './settings.component.html',
    styleUrl: './settings.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent implements OnInit, OnDestroy {

    preferencesManager = inject(UserPreferencesManager);
    translation = inject(TranslateService);

    languageOptions: MenuItem[] | undefined;
    themeOptions: MenuItem[] | undefined;

    private langChangeSub?: Subscription;

    ngOnInit() {
        this.updateMenuItems();

        this.langChangeSub = this.translation.onLangChange.subscribe(() => {
            this.updateMenuItems();
        });
    }

    updateMenuItems() {
        this.languageOptions = [
            {
                label: this.translation.instant(_('lang.en')),
                command: () => {
                    this.preferencesManager.changeLanguage(ApplicationLanguage.English);
                }
            },
            {
                label: this.translation.instant(_('lang.pl')),
                command: () => {
                    this.preferencesManager.changeLanguage(ApplicationLanguage.Polish);
                }
            }
        ];

        this.themeOptions = [
            {
                label: this.translation.instant(_('theme.light')),
                command: () => {
                    this.preferencesManager.changeTheme(ApplicationTheme.Light);
                }
            },
            {
                label: this.translation.instant(_('theme.dark')),
                command: () => {
                    this.preferencesManager.changeTheme(ApplicationTheme.Dark);
                }
            }
        ];
    }

    ngOnDestroy() {
        this.langChangeSub?.unsubscribe();
    }
}

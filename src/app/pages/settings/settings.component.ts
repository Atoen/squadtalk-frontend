import { Component } from '@angular/core';
import { Button } from 'primeng/button';

@Component({
    selector: 'app-settings',
    imports: [
        Button
    ],
    templateUrl: './settings.component.html',
    styleUrl: './settings.component.css'
})
export class SettingsComponent {
    toggleDarkMode() {
        document.querySelector('html')?.classList.toggle('app-dark');
    }
}

import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { FloatLabel } from 'primeng/floatlabel';
import { InputText } from 'primeng/inputtext';

@Component({
    selector: 'app-forgot-password',
    imports: [
        Button,
        Card,
        FloatLabel,
        FormsModule,
        InputText,
        ReactiveFormsModule,
    ],
    providers: [MessageService],
    templateUrl: './forgot-password.component.html',
    styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {

    private messageService = inject(MessageService)

    readonly loginForm = new FormGroup({
        email: new FormControl('')
    });

    onSubmit() {
        this.messageService.add({
            severity: 'success',
            summary: 'Reset password email sent',
            detail: 'Please check your inbox',
            life: 3000
        });
    }
}

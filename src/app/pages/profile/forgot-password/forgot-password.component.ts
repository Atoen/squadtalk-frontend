import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { FloatLabel } from 'primeng/floatlabel';
import { InputText } from 'primeng/inputtext';
import { NgIf } from '@angular/common';
import { Fluid } from "primeng/fluid";

@Component({
    selector: 'app-forgot-password',
    imports: [
        Button,
        Card,
        FloatLabel,
        FormsModule,
        InputText,
        ReactiveFormsModule,
        NgIf,
        Fluid,
    ],
    providers: [MessageService],
    templateUrl: './forgot-password.component.html',
    styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {

    private messageService = inject(MessageService)

    readonly forgotPasswordForm = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email])
    });

    get email() {
        return this.forgotPasswordForm.get('email');
    }

    onSubmit() {
        this.forgotPasswordForm.get('email')?.markAsDirty();

        this.messageService.add({
            severity: 'success',
            summary: 'Reset password email sent',
            detail: 'Please check your inbox',
            life: 3000
        });
    }
}

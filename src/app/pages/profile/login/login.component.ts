import { Component, inject } from '@angular/core';
import { Card } from 'primeng/card';
import { Password } from 'primeng/password';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { FloatLabel } from 'primeng/floatlabel';
import { InputText } from 'primeng/inputtext';
import { Checkbox } from 'primeng/checkbox';
import { Button } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import {NgIf} from '@angular/common';

@Component({
    selector: 'app-login',
    imports: [
        Card,
        Password,
        ReactiveFormsModule,
        FloatLabel,
        InputText,
        Checkbox,
        Button,
        RouterLink,
        Toast,
        NgIf
    ],
    providers: [MessageService],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent {

    private messageService = inject(MessageService)

    loginForm = new FormGroup({
        usernameOrEmail: new FormControl('', Validators.required),
        password: new FormControl('', Validators.required),
        rememberMe: new FormControl(true)
    });

    get usernameOrEmail() {
        return this.loginForm.get('usernameOrEmail');
    }

    get password() {
        return this.loginForm.get('password');
    }

    onSubmit() {
        this.usernameOrEmail?.markAsDirty();
        this.password?.markAsDirty();

        console.log('Login Data:', this.loginForm.value);
        console.log('Form valid:', this.loginForm.valid);
    }

    onResendActivationEmail() {
        this.messageService.add({
            severity: 'success',
            summary: 'Activation email sent',
            detail: 'Please check your inbox',
            life: 3000
        });
    }
}

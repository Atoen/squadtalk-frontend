import { Component, inject } from '@angular/core';
import { Card } from 'primeng/card';
import { Password } from 'primeng/password';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FloatLabel } from 'primeng/floatlabel';
import { InputText } from 'primeng/inputtext';
import { Checkbox } from 'primeng/checkbox';
import { Button } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';

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
        Toast
    ],
    providers: [MessageService],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent {

    private messageService = inject(MessageService)

    loginForm = new FormGroup({
        usernameOrEmail: new FormControl(''),
        password: new FormControl(''),
        rememberMe: new FormControl(true)
    });

    onSubmit() {
        console.log('Login Data:', this.loginForm.value);
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

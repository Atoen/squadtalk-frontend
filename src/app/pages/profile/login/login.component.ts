import {Component, inject, OnInit} from '@angular/core';
import { Card } from 'primeng/card';
import { Password } from 'primeng/password';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { FloatLabel } from 'primeng/floatlabel';
import { InputText } from 'primeng/inputtext';
import { Checkbox } from 'primeng/checkbox';
import { Button } from 'primeng/button';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import {NgIf} from '@angular/common';
import {UserLoginDto} from '../../../data/dtos/UserLoginDto';
import {UserAuthenticationService} from '../../../services/UserAuthenticationService';
import { Fluid } from "primeng/fluid";

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
        NgIf,
        Fluid
    ],
    providers: [MessageService],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

    private router = inject(Router);
    private route = inject(ActivatedRoute);

    private authenticationService = inject(UserAuthenticationService);
    private messageService = inject(MessageService)

    loginForm!: FormGroup;

    get usernameOrEmail() {
        return this.loginForm.get('usernameOrEmail');
    }

    get password() {
        return this.loginForm.get('password');
    }

    ngOnInit() {
       this.loginForm = new FormGroup({
           usernameOrEmail: new FormControl('', Validators.required),
           password: new FormControl('', Validators.required),
           rememberMe: new FormControl(true)
       });
    }

    async onSubmit() {
        this.usernameOrEmail?.markAsDirty();
        this.password?.markAsDirty();

        console.log('Login Data:', this.loginForm.value);
        console.log('Form valid:', this.loginForm.valid);

        if (this.loginForm.invalid) {
            return;
        }

        const formData: UserLoginDto = this.loginForm.value;
        const result = await this.authenticationService.login(formData);

        if (result.success && result.user) {

            const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
            await this.router.navigateByUrl(returnUrl);

            this.messageService.add({
                severity: 'success',
                summary: 'Logged in',
                detail: `Logged in as ${result.user.username} (id ${result.user.id})`,
                life: 3000
            });
        }
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

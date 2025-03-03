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
import {UserRegisterDto} from '../../../dto/UserRegisterDto';
import {UserLoginDto} from '../../../dto/UserLoginDto';
import {ProfileService} from '../../../services/ProfileService';

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
export class LoginComponent implements OnInit {

    private router = inject(Router);
    private route = inject(ActivatedRoute);

    private profileService = inject(ProfileService);
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

    onSubmit() {
        this.usernameOrEmail?.markAsDirty();
        this.password?.markAsDirty();

        console.log('Login Data:', this.loginForm.value);
        console.log('Form valid:', this.loginForm.valid);

        if (this.loginForm.invalid) {
            return;
        }

        const user: UserLoginDto = this.loginForm.value;

        this.profileService.login(user).subscribe({
            next: (response) => {
                console.log('Login successful:', response);

                this.profileService.getCurrentUser().subscribe({
                    next: (user) => {
                        if (user) {
                            this.profileService.isLoggedIn = true;

                            this.messageService.add({
                                severity: 'success',
                                summary: 'Logged in',
                                detail: `Logged in as ${user.username} (id ${user.id})`,
                                life: 3000
                            });

                            const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
                            this.router.navigateByUrl(returnUrl);
                        }
                    }
                })
            },
            error: (error) => {
                console.error('Login failed:', error);
            }
        });
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

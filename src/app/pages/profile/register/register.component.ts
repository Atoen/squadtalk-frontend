import {Component, inject, OnInit} from '@angular/core';
import { Button } from "primeng/button";
import { Card } from "primeng/card";

import { FloatLabel } from "primeng/floatlabel";
import {
    AbstractControl,
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    ValidationErrors,
    Validators
} from "@angular/forms";
import { InputText } from "primeng/inputtext";
import { Password } from "primeng/password";
import { RouterLink } from "@angular/router";
import {NgClass, NgIf} from '@angular/common';
import {ProfileService} from '../../../services/ProfileService';
import {UserRegisterDto} from '../../../dto/UserRegisterDto';

@Component({
    selector: 'app-register',
    imports: [
        Button,
        Card,
        FloatLabel,
        FormsModule,
        InputText,
        Password,
        ReactiveFormsModule,
        RouterLink,
        NgIf,
        NgClass,
    ],
    templateUrl: './register.component.html',
    styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {

    private profileService = inject(ProfileService);

    registerForm!: FormGroup;

    get passwordDontMatch(): boolean {
        return this.registerForm.errors?.['passwordsDoNotMatch'] &&
            this.registerForm.get('repeatPassword')?.dirty
    }

    fieldMissing(fieldName: 'username' | 'email' | 'password'): boolean {
        const field = this.registerForm.get(fieldName);
        return field?.hasError('required') && field?.dirty || false;
    }

    get username() {
        return this.registerForm.get('username');
    }

    get email() {
        return this.registerForm.get('email');
    }

    get password() {
        return this.registerForm.get('password');
    }

    ngOnInit() {
        this.registerForm = new FormGroup(
            {
                username: new FormControl('', [
                    Validators.required,
                    Validators.minLength(3),
                    Validators.maxLength(32),
                ]),
                email: new FormControl('', [
                    Validators.required,
                    Validators.email
                ]),
                password: new FormControl('', [
                    Validators.required,
                    Validators.minLength(8),
                    Validators.maxLength(64)
                ]),
                repeatPassword: new FormControl('', [
                    Validators.required
                ])
            },
            {
                validators: this.passwordsMatchValidator
            }
        );

        this.registerForm.get('password')?.valueChanges.subscribe(() => {
            this.registerForm.get('repeatPassword')?.updateValueAndValidity();
        });
    }

    private passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
        const password = group.get('password')?.value;
        const repeatPassword = group.get('repeatPassword')?.value;
        return password === repeatPassword ? null : { passwordsDoNotMatch: true };
    }

    onSubmit() {
        this.username?.markAsDirty();
        this.email?.markAsDirty();
        this.password?.markAsDirty();

        console.log('Register data:', this.registerForm.value);
        console.log('Form valid:', this.registerForm.valid);

        if (this.registerForm.invalid) {
            return;
        }

        const user: UserRegisterDto = this.registerForm.value;

        this.profileService.register(user).subscribe({
            next: (response) => {
                console.log('Registration successful:', response);
            },
            error: (error) => {
                console.error('Registration failed:', error);
            }
        });
    }
}

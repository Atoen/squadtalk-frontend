import { Component, inject, OnInit, signal } from '@angular/core';
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
import { NgClass, NgIf } from '@angular/common';
import { UserAuthenticationService } from '../../../services';
import { UserRegisterDto } from '@data/dtos';
import { Fluid } from "primeng/fluid";
import { TranslatePipe } from "@ngx-translate/core";

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
        Fluid,
        TranslatePipe,
    ],
    templateUrl: './register.component.html',
    styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {

    private profileService = inject(UserAuthenticationService);

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

    get repeatPassword() {
        return this.registerForm.get('repeatPassword')
    }

    readonly working = signal(false);

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

    async onSubmit() {
        this.username?.markAsDirty();
        this.email?.markAsDirty();
        this.password?.markAsDirty();
        this.repeatPassword?.markAsDirty();

        if (this.registerForm.invalid) {
            return;
        }

        this.working.set(true);

        const formData: UserRegisterDto = this.registerForm.value;
        const result = await this.profileService.register(formData);

        this.working.set(false);

        if (result.success) {
            console.log('Registration successful');
        } else {
            console.error('Registration failed:', result.error);
        }
    }
}

import { Component, OnInit } from '@angular/core';
import { Button } from "primeng/button";
import { Card } from "primeng/card";

import { FloatLabel } from "primeng/floatlabel";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { InputText } from "primeng/inputtext";
import { Password } from "primeng/password";
import { RouterLink } from "@angular/router";

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
        RouterLink
    ],
    templateUrl: './register.component.html',
    styleUrl: './register.component.css'
})
export class RegisterComponent {

    registerForm = new FormGroup({
        username: new FormControl(''),
        email: new FormControl(''),
        password: new FormControl(''),
        repeatPassword: new FormControl('')
    });

    onSubmit() {
        console.log('Register data:', this.registerForm.value)
    }
}

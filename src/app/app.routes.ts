import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/profile/login/login.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { RegisterComponent } from './pages/profile/register/register.component';
import { ForgotPasswordComponent } from './pages/profile/forgot-password/forgot-password.component';
import { AuthGuard } from './services/AuthGuard';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'profile/login', component: LoginComponent, title: 'Login' },
    { path: 'profile/register', component: RegisterComponent, title: 'Register' },
    { path: 'profile/forgot-password', component: ForgotPasswordComponent, title: 'Forgot password'},
    { path: 'settings', component: SettingsComponent, title: 'Settings', canActivate: [AuthGuard] },
    { path: '**', redirectTo: 'not-found', pathMatch: 'full' },
    { path: 'not-found', component: NotFoundComponent, title: 'Page not found' }
];

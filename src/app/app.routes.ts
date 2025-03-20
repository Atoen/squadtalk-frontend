import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { AuthGuard } from './services';
import { MessagesComponent } from "./pages/messages/messages.component";
import { ContactsComponent } from "./pages/contacts/contacts.component";
import { ChatComponent } from "./pages/chat/chat.component";

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'messages', component: MessagesComponent, title: 'Messages', canActivate: [AuthGuard] },
    { path: 'chat/:id', component: ChatComponent, title: 'Chat', canActivate: [AuthGuard] },
    { path: 'contacts', component: ContactsComponent, title: 'Contacts', canActivate: [AuthGuard] },
    { path: 'settings', component: SettingsComponent, title: 'Settings' },
    {
        path: 'profile/login',
        loadComponent: () => import('./pages/profile/login/login.component').then(m => m.LoginComponent),
        title: 'Login'
    },
    {
        path: 'profile/register',
        loadComponent: () => import('./pages/profile/register/register.component').then(m => m.RegisterComponent),
        title: 'Register'
    },
    {
        path: 'profile/forgot-password',
        loadComponent: () => import('./pages/profile/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent),
        title: 'Forgot Password'
    },
    {
        path: 'not-found',
        loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent),
        title: 'Page Not Found'
    },
    { path: '**', redirectTo: 'not-found', pathMatch: 'full' }
];

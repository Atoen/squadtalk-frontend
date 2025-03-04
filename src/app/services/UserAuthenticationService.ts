import { computed, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserRegisterDto } from '../data/dtos/UserRegisterDto';
import { firstValueFrom } from 'rxjs';
import { UserLoginDto } from '../data/dtos/UserLoginDto';
import { UserDto } from '../data/dtos/UserDto';
import { StoredUserData } from "../data/local-storage/StoredUserData";
import { UserStatus } from "../data/enums/UserStatus";
import { UserId } from "../data/ids/UserId";

@Injectable({ providedIn: "root" })
export class UserAuthenticationService {
    private readonly apiUrl = "https://localhost:1230/api/account";
    private readonly userDataKey = 'currentUser';

    private http = inject(HttpClient);

    private _authenticationState: WritableSignal<AuthenticationState> = signal(AuthenticationState.Unknown);
    private _currentUser = signal<UserDto | null>(null);

    authenticationState = this._authenticationState.asReadonly();
    isLoggedIn = computed(() =>
        [AuthenticationState.PendingVerification, AuthenticationState.Authenticated].includes(this.authenticationState())
    );

    currentUser = this._currentUser.asReadonly();

    async login(user: UserLoginDto): Promise<LoginResult> {
        try {
            const request = this.http.post<UserDto | null>(`${this.apiUrl}/login`, user, {
                withCredentials: true
            });

            const userData = await firstValueFrom(request);
            this.setCurrentUser(userData);

            return { success: !!userData, user: userData };
        } catch (error) {
            return { success: false, user: null, error };
        }
    }

    async register(user: UserRegisterDto): Promise<RegisterResult> {
        try {
            const response = await firstValueFrom(this.http.post(`${this.apiUrl}/register`, user, {
                observe: "response"
            }));

            return { success: response.ok }
        } catch (error) {
            return { success: false, error }
        }
    }

    logOut() {
        localStorage.removeItem(this.userDataKey);

        const request = this.http.post(`${this.apiUrl}/logout?returnUrl=ng`, {}, {
            withCredentials: true
        });

        request.subscribe(() => window.location.reload());
    }

    async verifyCurrentUser(): Promise<UserDto | null> {
        const request = this.http.get<UserDto | null>(`${this.apiUrl}/me`, {
            withCredentials: true
        });

        try {
            const user = await firstValueFrom(request);

            console.log("Verified user:", user);

            this.setCurrentUser(user);

            return user;
        }
        catch {
            this.setCurrentUser(null);
            return null;
        }

    }

    tryReadStoredUser() {
        const data = localStorage.getItem(this.userDataKey);

        console.log("retrieved", data);

        if (!data) {
            this.setCurrentUser(null, false);
            return false;
        }

        const storedUser: StoredUserData = JSON.parse(data);
        const user = new UserDto(storedUser.username, new UserId(''), UserStatus.Unknown);

        this.setCurrentUser(user, false);

        return true;
    }

    private setCurrentUser(user: UserDto | null, updateLocalStorage: boolean = true) {
        if (updateLocalStorage) {
            if (user) {
                localStorage.setItem(this.userDataKey, JSON.stringify(user));
            } else {
                localStorage.removeItem(this.userDataKey);
            }
        }

        this._currentUser.set(user);
        const authState = !user ? AuthenticationState.Unauthenticated
            : user.id.value ? AuthenticationState.Authenticated : AuthenticationState.PendingVerification;

        this._authenticationState.set(authState);
    }
}

export enum AuthenticationState {
    Unknown = "Unknown",
    Unauthenticated = "Unauthenticated",
    PendingVerification = "PendingVerification",
    Authenticated = "Authenticated"
}

export interface RegisterResult {
    success: boolean,
    error?: any
}

export interface LoginResult {
    success: boolean,
    user: UserDto | null,
    error?: any;
}

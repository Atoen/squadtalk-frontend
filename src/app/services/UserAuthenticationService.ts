import { computed, Inject, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserDto, UserLoginDto, UserRegisterDto } from '@data/dtos';
import { firstValueFrom } from 'rxjs';
import { isPlatformBrowser } from "@angular/common";
import { User } from '@data/models';
import { UserStatus } from "@data/enums";

@Injectable({ providedIn: "root" })
export class UserAuthenticationService {
    private readonly userDataKey = 'currentUser';

    private http = inject(HttpClient);

    private _authenticationState = signal(AuthenticationState.PendingVerification);
    private _currentUser = signal<UserDto | null>(null);

    private _verifiedUser = false;

    authenticationState = this._authenticationState.asReadonly();
    isLoggedIn = computed(() =>
        [AuthenticationState.PendingVerification, AuthenticationState.Authenticated].includes(this.authenticationState())
    );

    currentUser = this._currentUser.asReadonly();

    constructor(@Inject(PLATFORM_ID) platformId: Object) {
        if (isPlatformBrowser(platformId)) {
            this.tryReadStoredUser();
        }
    }

    async login(user: UserLoginDto): Promise<LoginResult> {
        try {
            const request = this.http.post<UserDto | null>('/api/account/login', user, {
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
            const response = await firstValueFrom(this.http.post('/api/account/register', user, {
                observe: "response"
            }));

            return { success: response.ok }
        } catch (error) {
            return { success: false, error }
        }
    }

    logOut() {
        localStorage.removeItem(this.userDataKey);

        const request = this.http.post('/api/account/logout?returnUrl=ng', {}, {
            withCredentials: true
        });

        request.subscribe(() => window.location.reload());
    }

    async verifyCurrentUser(): Promise<User | null> {
        const request = this.http.get<UserDto | null>('/api/account/me', {
            withCredentials: true
        });

        try {
            const userDto = await firstValueFrom(request);
            if (userDto) {
                const user = new User(userDto, true);
                this._verifiedUser = true;

                console.log("Verified user:", user);

                this.setCurrentUser(userDto);

                return user;
            }

            return null;
        }
        catch {
            this.setCurrentUser(null);
            return null;
        }
    }

    // TODO: better
    setPrerender(username: string) {
        const user: UserDto = {
            username: username,
            status: UserStatus.Unknown,
            id: '',
            packed: [username, [''], 0],
        };

        this.setCurrentUser(user, false);
    }

    private tryReadStoredUser() {
        const data = localStorage.getItem(this.userDataKey);

        console.log("retrieved", data);

        if (!data) {
            this.setCurrentUser(null, false);
            return false;
        }

        const storedUser: UserDto = JSON.parse(data);
        this.setCurrentUser(storedUser, false);

        return true;
    }

    private setCurrentUser(user: UserDto | null, updateLocalStorage: boolean = true) {
        if (updateLocalStorage) {
            if (user) {
                document.cookie = `ud=${user.username}; path=/; Max-Age=31536000; SameSite=Strict`;
                localStorage.setItem(this.userDataKey, JSON.stringify(user));
            } else {
                localStorage.removeItem(this.userDataKey);
            }
        }

        this._currentUser.set(user);
        const authState = !user ? AuthenticationState.Unauthenticated
            : this._verifiedUser ? AuthenticationState.Authenticated : AuthenticationState.PendingVerification;

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

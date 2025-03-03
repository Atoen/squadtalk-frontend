import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {UserRegisterDto} from '../dto/UserRegisterDto';
import {Observable} from 'rxjs';
import {UserLoginDto} from '../dto/UserLoginDto';
import {UserDto} from '../dto/UserDto';

@Injectable({ providedIn: "root" })
export class ProfileService {
    private readonly apiUrl = "http://localhost:1235/api/account";
    private http = inject(HttpClient);

    isLoggedIn = false;

    register(user: UserRegisterDto): Observable<any> {
        return this.http.post(`${this.apiUrl}/register`, user);
    }

    login(user: UserLoginDto): Observable<any> {
        return this.http.post(`${this.apiUrl}/login`, user);
    }

    logout(): Observable<any> {
        return this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true });
    }

    getCurrentUser(): Observable<UserDto | null> {
        return this.http.get<UserDto | null>(`${this.apiUrl}/me`, { withCredentials: true });
    }
}

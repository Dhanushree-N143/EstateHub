import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface AuthUser {
  username: string;
  displayName: string;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export interface RegisterResponse {
  message: string;
  user: AuthUser;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tokenKey = 'estatehub_token';
  private readonly userKey = 'estatehub_user';

  login(username: string, password: string, rememberMe: boolean): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('/api/auth/login', { username, password }).pipe(
      tap(response => {
        this.clearStoredAuth();
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem(this.tokenKey, response.token);
        storage.setItem(this.userKey, JSON.stringify(response.user));
      })
    );
  }

  register(username: string, password: string, displayName: string): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>('/api/auth/register', {
      username,
      password,
      displayName
    });
  }

  logout(): void {
    this.clearStoredAuth();
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getDisplayName(): string {
    try {
      const raw = localStorage.getItem(this.userKey) ?? sessionStorage.getItem(this.userKey);
      return JSON.parse(raw ?? '{}').displayName ?? 'Guest';
    } catch {
      return 'Guest';
    }
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey) ?? sessionStorage.getItem(this.tokenKey);
  }

  private clearStoredAuth(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    sessionStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem(this.userKey);
  }
}

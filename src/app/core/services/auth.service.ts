import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'ftn_token';
  private readonly USER_KEY = 'ftn_user';

  private _user = new BehaviorSubject<User | null>(this.loadUser());
  currentUser$ = this._user.asObservable();

  constructor(private api: ApiService, private router: Router) {}

  login(email: string, password: string): Observable<any> {
    return this.api.post<any>('/auth/login', { email, password }).pipe(
      tap((res: any) => {
        const p = res?.data ?? res;
        const token: string = p?.accessToken ?? p?.access_token ?? p?.token;
        const user: User = {
          id: p?.id ?? '',
          email: p?.email ?? '',
          firstName: p?.firstName ?? '',
          lastName: p?.lastName ?? '',
          role: p?.role ?? 'ATHLETE',
          isActive: true,
          createdAt: new Date().toISOString(),
        };
        localStorage.setItem(this.TOKEN_KEY, token);
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
        this._user.next(user);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this._user.next(null);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null { return localStorage.getItem(this.TOKEN_KEY); }
  isLoggedIn(): boolean { return !!this.getToken(); }
  hasRole(role: string): boolean { return this._user.value?.role === role; }
  get currentUser(): User | null { return this._user.value; }

  private loadUser(): User | null {
    const raw = localStorage.getItem(this.USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }
}

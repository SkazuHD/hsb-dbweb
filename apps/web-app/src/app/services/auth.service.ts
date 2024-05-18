import {computed, inject, Injectable, signal} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { BehaviorSubject, exhaustMap, map, Observable, of, tap } from 'rxjs';
import {NotificationService} from './notification.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {HttpClient} from '@angular/common/http';
import {AccessTokenPayload, registerCredential, User} from '@hsb-dbweb/shared';
import {Error} from "@firebase/auth-types";

export type AuthUser = User | null | undefined;
export type AuthIdToken = string | null | undefined;
export type AuthAccessToken = string | null | undefined;
export type AuthRefreshToken = string | null | undefined;

interface AuthState {
  user: AuthUser;
  idToken: AuthIdToken;
  accessToken?: AuthAccessToken;
  refreshToken?: AuthRefreshToken;
}

export type Credentials = {
  email: string;
  password: string;
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$ = new BehaviorSubject<AuthUser>(null)
  accessToken$ = new BehaviorSubject<AuthAccessToken>(null)
  //Sources
  private dialog = inject(MatDialog);
  private notificationService: NotificationService =
    inject(NotificationService);
  private http = inject(HttpClient);
  private idToken$ = new BehaviorSubject<AuthIdToken>(null)
  private refreshToken$ = new BehaviorSubject<AuthRefreshToken>(null)
  //State
  private state = signal<AuthState>({
    user: undefined,
    idToken: undefined,
    accessToken: undefined,
    refreshToken: undefined,
  });
  //Selectors
  user = computed(() => this.state().user);
  idToken = computed(() => this.state().idToken);
  accessToken = computed(() => this.state().accessToken);
  refreshToken = computed(() => this.state().refreshToken);
  private apiURL = 'http://localhost:4201/api';

  constructor() {
    this.refreshToken$.next(localStorage.getItem('refreshToken') || undefined);

    // Side effects
    this.user$.pipe(takeUntilDestroyed()).subscribe((user) => {
      return this.state.update((state) => ({
        ...state,
        user,
      }));
    });
    this.idToken$.pipe(takeUntilDestroyed()).subscribe((idToken) => {
      setTimeout(() => {
        if (this.isTokenExpired(idToken, 60)) {
          this.refreshTokens().subscribe();
        }
      }, this.getTokenExpirationTime(idToken).getTime() - new Date().getTime() - 60000)
      return this.state.update((state) => ({
        ...state,
        idToken,
      }));
    });
    this.accessToken$.pipe(takeUntilDestroyed()).subscribe((accessToken) => {
      setTimeout(() => {
        if (this.isTokenExpired(accessToken, 60)) {
          this.refreshTokens().subscribe();
        }
      }, this.getTokenExpirationTime(accessToken).getTime() - new Date().getTime() - 60000)
      console.log(accessToken)
      return this.state.update((state) => ({
        ...state,
        accessToken,
      }));
    });
    this.refreshToken$.pipe(takeUntilDestroyed()).subscribe((refreshToken) => {
      localStorage.setItem('refreshToken', refreshToken || '');
      setTimeout(() => {
        if (this.isTokenExpired(refreshToken, 60)) {
          this.refreshTokens().subscribe();
        }
      }, this.getTokenExpirationTime(refreshToken).getTime() - new Date().getTime() - 60000)

      return this.state.update((state) => ({
        ...state,
        refreshToken,
      }));
    });
  }

  async requestLoginDialog() {
    const {LoginComponent} = await import(
      '../components/dialog/login/login.component'
      );
    return this.dialog.open(LoginComponent, {
      autoFocus: 'input',
    });
  }



  async requestRegisterDialog() {
    const {RegisterComponent} = await import(
      '../components/dialog/register/register.component'
      );
    return this.dialog.open(RegisterComponent, {
      autoFocus: 'input',
    });
  }

  async requestPasswordReset() {
    const {ResetPasswordComponent} = await import(
      '../components/dialog/reset-password/reset-password.component'
      );
    return this.dialog
      .open(ResetPasswordComponent, {
        autoFocus: 'input',
      })
      .afterClosed()
      .subscribe((email) => {
        if (!email) {
          return;
        }
        this.notificationService.error('Currently not Available');

      });
  }

  signInWithGoogle$(): Observable<User | null> {
    this.notificationService.error('Currently not Available');
    return new Observable();
  }

  signInWithEmail$(credentials: Credentials): Observable<AuthUser | Error> {
    //TODO ERROR HANDLING
    return this.http.post<AuthState & { message: string }>(this.apiURL + '/auth' + '/login', {
        email: credentials.email,
        password: credentials.password,

      }, {
        withCredentials: true,
      }
    ).pipe(tap((res) => {
      this.handleAuthStateChange(res)

    }), map((res) => res.user));
  }

  signUpWithEmail$(
    credentials: registerCredential,
  ): Observable<AuthUser | Error> {
    //TODO ERROR HANDLING
    return this.http.post<AuthState & { message: string }>(
      this.apiURL + '/auth' + '/register',
      {
        username: credentials.username,
        password: credentials.password,
        email: credentials.email,
      },
      {
        withCredentials: true,
      }
    ).pipe(tap((res) => {
      this.handleAuthStateChange(res)

    }), map((res) => res.user));
  }

  logout() {
    const authState = {
      user: null,
      idToken: null,
      accessToken: null,
      refreshToken: null,
      message: 'Logged out successfully',
    }
    this.handleAuthStateChange(authState)
  }

  isTokenExpired(token: AuthAccessToken | AuthRefreshToken | AuthIdToken, offsetSeconds = 0): boolean {
    token = token || '';
    const tokenParts = token.split('.');
    if (tokenParts.length < 2) return true;
    const tokenDecoded = JSON.parse(atob(tokenParts[1]));
    const now = new Date();
    return (tokenDecoded.exp * 1000 - offsetSeconds * 1000) < now.getTime();
  }

  getTokenExpirationTime(token: AuthAccessToken | AuthRefreshToken | AuthIdToken): Date {
    token = token || '';
    const tokenParts = token.split('.');
    if (tokenParts.length < 2) return new Date(0);
    const tokenDecoded = JSON.parse(atob(tokenParts[1]));
    return new Date(tokenDecoded.exp * 1000);
  }

  refreshTokens(): Observable<AuthUser | Error> {
    if (!this.refreshToken()) return new Observable();
    return of(this.refreshToken()).pipe(
      exhaustMap((refreshToken) => {
        return this.http.post<AuthState & { message: string }>(
          this.apiURL + '/auth' + '/refresh',
          {
            refreshToken: refreshToken,
          },
          {
            withCredentials: true,
          }
        )
      }),
      tap((res) => {
        this.handleAuthStateChange(res)
      }),
      map((res) => res.user)
    );
  }

  getRoleClaims(token: AuthAccessToken): string {

    const tokenParts = token?.split('.') || []
    if (tokenParts.length < 2) [];
    const tokenDecoded: AccessTokenPayload = JSON.parse(atob(tokenParts[1]));
    return tokenDecoded.role || ''

  }

  private handleAuthStateChange(AuthState: AuthState & { message: string }) {
    this.idToken$.next(AuthState.idToken);
    this.accessToken$.next(AuthState.accessToken);
    this.refreshToken$.next(AuthState.refreshToken);
    this.user$.next(AuthState.user);
    this.notificationService.success(AuthState.message);
  }

}

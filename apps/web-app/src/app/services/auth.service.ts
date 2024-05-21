import {computed, inject, Injectable, signal} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {BehaviorSubject, map, Observable, tap} from 'rxjs';
import {NotificationService} from './notification.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {HttpClient} from '@angular/common/http';
import {registerCredential, User} from '@hsb-dbweb/shared';
import {Error} from "@firebase/auth-types";

export type AuthUser = User | null | undefined;
export type AuthIdToken = string | null | undefined;

interface AuthState {
  user: AuthUser;
  idToken: AuthIdToken;
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
  //Sources
  private dialog = inject(MatDialog);
  private notificationService: NotificationService =
    inject(NotificationService);
  private http = inject(HttpClient);
  private idToken$ = new BehaviorSubject<AuthIdToken>(null)
  //State
  private state = signal<AuthState>({
    user: undefined,
    idToken: undefined,
  });
  //Selectors
  user = computed(() => this.state().user);
  idToken = computed(() => this.state().idToken);
  private apiURL = 'http://localhost:4201/api';

  // TODO IMPLEMENT PERSISTENCE OF JWT TOKEN 

  constructor() {
    // Side effects
    this.user$.pipe(takeUntilDestroyed()).subscribe((user) => {
      console.debug('User', user);
      return this.state.update((state) => ({
        ...state,
        user,
      }));
    });
    this.idToken$.pipe(takeUntilDestroyed()).subscribe((idToken) => {
      return this.state.update((state) => ({
        ...state,
        idToken,
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

    }).pipe(tap((res) => {
      this.user$.next(res.user);
      this.idToken$.next(res.idToken);
      this.notificationService.success(res.message);

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
    ).pipe(tap((res) => {
      this.user$.next(res.user);
      this.idToken$.next(res.idToken);
      this.notificationService.success(res.message);

    }), map((res) => res.user));
  }

  logout() {
    this.user$.next(null);
    this.idToken$.next(null);
    this.notificationService.success('Logged out');
  }


}

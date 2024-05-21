import {computed, inject, Injectable, signal} from '@angular/core';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  idToken,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  User
} from "@angular/fire/auth";
import {MatDialog} from "@angular/material/dialog";
import {NotificationService} from "./notification.service";
import {HttpClient} from "@angular/common/http";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {from, Observable} from "rxjs";


export type AuthUser = User | null | undefined;

export type Credentials = {
  email: string;
  password: string;
};

interface AuthState {
  user: AuthUser;
  idToken: string | null | undefined;
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthService {
  /**
   * DO NOT TOUCH WILL BE USED IN THE FUTURE
   *
   */

  private dialog = inject(MatDialog);
  private notificationService: NotificationService = inject(NotificationService);
  private http = inject(HttpClient);
  private auth: Auth = inject(Auth);
  //Sources
  user$ = authState(this.auth);
  private idToken$ = idToken(this.auth);
  //State
  private state = signal<AuthState>({
    user: undefined,
    idToken: undefined,
  });
  //Selectors
  user = computed(() => this.state().user);
  idToken = computed(() => this.state().idToken);

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

  requestEmailVerification(user: User) {
    //TODO
    this.dialog
      .open(MatDialog, {
        autoFocus: 'input',
      })
      .close(
        sendEmailVerification(user).then(() => {
          console.debug('Email verification sent');
        }),
      );
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
        sendPasswordResetEmail(this.auth, email).then(() => {
          this.notificationService.info('Password reset email sent');
        });
      });
  }

  signInWithGoogle$(): Observable<User | null> {
    const provider = new GoogleAuthProvider();
    return from(
      signInWithPopup(this.auth, provider)
        .then((result) => {
          this.notificationService.success('Login successful');
          return result.user;
        })
        .catch((error) => {
          this.notificationService.error(error.code);
          throw error;
        }),
    );
  }

  signInWithEmail$(credentials: Credentials): Observable<User | null | Error> {
    return from(
      signInWithEmailAndPassword(
        this.auth,
        credentials.email,
        credentials.password,
      )
        .then((result) => {
          this.notificationService.success('Login successful');
          return this.handleSignIn(result.user);
        })
        .catch((error) => {
          this.notificationService.error(error.code);
          return error;
        }),
    );
  }

  signUpWithEmail$(
    email: string,
    password: string,
  ): Observable<User | null | Error> {
    return from(
      createUserWithEmailAndPassword(this.auth, email, password)
        .then((result) => {
          this.notificationService.success('Registration successful');
          return result.user;
        })
        .catch((error) => {
          this.notificationService.error(error.code);
          return error;
        }),
    );
  }

  logout() {
    signOut(this.auth).then(() => {
      this.notificationService.info('Signed out');
    });
  }

  private handleSignIn(user: User) {
    if (!user.emailVerified) {
      this.requestEmailVerification(user);
    }
    return user;
  }
}

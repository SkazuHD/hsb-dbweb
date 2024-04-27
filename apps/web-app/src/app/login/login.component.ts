import {Component, inject} from '@angular/core';
import {MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle,} from '@angular/material/dialog';
import {AuthService, Credentials} from '../../../services/auth.service';
import {MatFormField, MatFormFieldModule} from '@angular/material/form-field';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators,} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatDivider} from '@angular/material/divider';
import {RouterLink} from '@angular/router';
import {CommonModule} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogTitle,
    MatDialogContent,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatFormField,
    MatInputModule,
    FormsModule,
    MatButton,
    MatDivider,
    RouterLink,
    MatDialogClose,
    MatIconModule,
    MatIconButton,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  dialogRef = inject(MatDialogRef);
  authService = inject(AuthService);
  protected readonly alert = alert;
  loginForm = new FormGroup(
    {
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    },
    {updateOn: 'blur'},
  );
  isLoading = false;

  onRegister() {
    this.dialogRef.close();
    this.authService.requestRegisterDialog();
  }

  onSignIn() {
    this.loginForm.markAllAsTouched();
    this.loginForm.updateValueAndValidity()
    if (this.loginForm.invalid) {
      return;
    }
    this.isLoading = true;
    const credentials: Credentials = {
      email: this.loginForm.get('email')?.value ?? '',
      password: this.loginForm.get('password')?.value ?? '',
    };

    this.authService.signInWithEmail$(credentials).subscribe({
      next: (result) => {
        if (result instanceof Error) {
          this.isLoading = false;
        } else {
          this.dialogRef.close();
          this.isLoading = false;
        }
      },
    });
  }

  onGoogleSignIn() {
    this.authService.signInWithGoogle$().subscribe({
      next: (result) => {
        this.dialogRef.close();
      },
    });
  }
}

import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { AuthService } from '../services/auth.service';
import {
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { Component, inject } from '@angular/core';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { AsyncPipe } from '@angular/common';
import { MatIcon, MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatFormField,
    MatInputModule,
    FormsModule,
    MatButton,
    MatDivider,
    AsyncPipe,
    MatDialogClose,
    MatIcon,
    MatIconButton,
    MatIconModule,
  ],
})
export class RegisterComponent {
  private dialogRef = inject(MatDialogRef);
  private authService = inject(AuthService);
  formGroup: FormGroup = new FormGroup(
    {
      email: new FormControl('', [Validators.required, Validators.email]),
      password1: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
      password2: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
    },
    { validators: [Validators.required], updateOn: 'blur' },
  );
  isLoading = false;

  constructor() {
    this.formGroup.setValidators(this.checkPasswords);
  }

  onGoogleSignIn() {
    this.authService.signInWithGoogle$().subscribe({
      next: (result) => {
        this.dialogRef.close();
      },
    });
  }

  onSignUp() {
    if (this.formGroup?.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    this.authService
      .signUpWithEmail$(
        this.formGroup.get('email')?.value,
        this.formGroup.get('password1')?.value,
      )
      .subscribe({
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

  checkPasswords: ValidatorFn = (
    group: AbstractControl,
  ): ValidationErrors | null => {
    const pass = group.get('password1')?.value;
    const confirmPass = group.get('password2')?.value;
    const result = pass === confirmPass;
    if (!result) {
      group.get('password2')?.setErrors({ notEqual: true });
    }
    return result ? null : { notEqual: true };
  };
}

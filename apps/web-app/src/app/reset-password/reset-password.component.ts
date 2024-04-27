import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import {
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import {
  MatError,
  MatFormField,
  MatFormFieldModule,
} from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButton,
    MatDialogContent,
    MatDivider,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatFormField,
    MatDialogTitle,
    MatInput,
    MatError,
    MatIconButton,
    MatIcon,
    MatDialogClose,
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css',
})
export class ResetPasswordComponent {
  resetPasswordForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });
  private dialog: MatDialogRef<string> = inject(MatDialogRef);

  onResetPassword() {
    if (this.resetPasswordForm.invalid) {
      return;
    }
    this.dialog.close(this.resetPasswordForm.value.email);
  }
}

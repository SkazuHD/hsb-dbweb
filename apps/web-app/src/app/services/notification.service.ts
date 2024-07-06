import {inject, Injectable} from '@angular/core';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private snackBar: MatSnackBar = inject(MatSnackBar);

  defaultConfig: MatSnackBarConfig = {
    duration: 3500,
    verticalPosition: 'bottom',
    horizontalPosition: 'center',
  };

  info(message: string) {
    this.snackBar.open(message, 'Close', {
      ...this.defaultConfig,
      panelClass: ['info'],
    });
  }

  error(message: string) {
    this.snackBar.open(message, 'Close', {
      ...this.defaultConfig,
      panelClass: ['error'],
    });
  }

  success(message: string) {
    this.snackBar.open(message, 'Close', {
      ...this.defaultConfig,
      panelClass: ['success'],
    });
  }

  warn(message: string) {
    this.snackBar.open(message, 'Close', {
      ...this.defaultConfig,
      panelClass: ['warn'],
    });
  }
}

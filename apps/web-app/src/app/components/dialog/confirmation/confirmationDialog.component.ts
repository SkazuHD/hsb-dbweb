import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContainer,
  MatDialogContent,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";

export interface ConfirmationDialogData {
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
}

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogContainer, MatDialogContent, MatDialogTitle, MatDialogActions, MatButton, MatDialogClose],
  templateUrl: './confirmationDialog.component.html',
  styleUrl: './confirmationDialog.component.css',
})
export class ConfirmationDialogComponent {
  data: ConfirmationDialogData = inject(MAT_DIALOG_DATA)
}

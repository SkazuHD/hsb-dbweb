import { Component, inject } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import {
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../services/auth.service';
import { ApiService } from '../../../services/api.service';
import { Image } from '@hsb-dbweb/shared';
@Component({
  selector: 'app-add-picture',
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
    AsyncPipe,
    MatDialogClose,
    MatIcon,
    MatIconButton,
    MatIconModule,
  ],
  templateUrl: './add-picture.component.html',
  styleUrl: './add-picture.component.css',
})
export class AddPictureComponent {
  private dialogRef = inject(MatDialogRef);
  private apiService = inject(ApiService);
  formGroup: FormGroup = new FormGroup(
    {
      picture: new FormControl('', [Validators.required]),
      alt: new FormControl('', [Validators.required]),
    },
    { validators: [Validators.required], updateOn: 'blur' },
  );
  
  isLoading = false;
 
  onAdd() {
    if (this.formGroup?.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    const image: Image = {
      url: this.formGroup.get('picture')?.value,
      alt: this.formGroup.get('alt')?.value,
    };
    this.apiService.addPicture(image).subscribe({
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
}

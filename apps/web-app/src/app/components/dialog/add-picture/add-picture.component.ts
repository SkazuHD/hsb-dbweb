import {Component, inject, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatDialogModule, MatDialogRef,} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {ApiService} from '../../../services/api.service';
import {Image} from '@hsb-dbweb/shared';
import {UploadFileComponent} from "../../upload-file/upload-file.component";
import {MatInputModule} from "@angular/material/input";

@Component({
  selector: 'app-add-picture',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    UploadFileComponent,
    ReactiveFormsModule,
    MatInputModule
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
    {validators: [Validators.required], updateOn: 'blur'},
  );

  imageId = signal(undefined)

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

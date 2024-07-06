import {Component, inject, input, model} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {HttpClient} from '@angular/common/http';
import {NotificationService} from '../../services/notification.service';
import {ApiService} from "../../services/api.service";

@Component({
  selector: 'app-upload-file',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatIconModule, MatButtonModule],
  templateUrl: './upload-file.component.html',
  styleUrl: './upload-file.component.css'
})
export class UploadFileComponent {

  showPreview = input<boolean>(false);

  //Emits the id of the image that was uploaded
  fileUploaded = model<string | number | undefined>('')

  http = inject(HttpClient);
  api = inject(ApiService)
  notification = inject(NotificationService);

  previewUrl = '';

  fileUploadForm: FormGroup = new FormGroup({
    fileName: new FormControl(''),
    file: new FormControl(null)
  });

  onFileChange(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      const file = (event.target.files[0] as File);
      if (!file) return;
      this.fileUploadForm.get('file')?.setValue(file);
      this.previewUrl = URL.createObjectURL(file);
    }
  }

  onUpload() {
    const file = this.fileUploadForm.get('file')?.getRawValue();
    if (!file) return;
    const formData = new FormData();
    formData.append('media', file);

    this.api.addImage(file).subscribe(
      (res) => {
        this.fileUploadForm.reset();
        this.notification.success(res.message + ' (' + res.id + ')');
        this.fileUploaded.set(res.id);
        //JUST FOR TESTING THAT THE IMAGE IS ACTUALLY UPLOADED
        this.api.getImageById(res.id.toString()).subscribe((res) => {
          this.previewUrl = URL.createObjectURL(res);
        })
      })


  }
}

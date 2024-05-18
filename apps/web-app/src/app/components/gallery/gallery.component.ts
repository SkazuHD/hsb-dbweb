import { Component, inject, model, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetatagService } from '../../services/metatag.service';
import { ApiService } from '../../services/api.service';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { Image, UserRole } from '../../../../../../libs/shared/src/lib/types/types';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatDialogClose } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [
    CommonModule,
    MatIcon,
    MatIconButton,
    MatIconModule,
    MatDialogClose,
    MatButton,
  ],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.css',
})
export class GalleryComponent implements OnInit {
  apiService = inject(ApiService);
  auth= inject(AuthService)
  gallery = model.required<Image[]>();

  ngOnInit(): void {
    this.apiService.getGallery().subscribe((images) => {
      this.gallery.set(images);
    });
  }


  updateGallery() {
    this.apiService.getGallery().subscribe((images) => {
      this.gallery.set(images);
    });
  }


  requestAddPictureDialog() {
    this.apiService.requestAddPictureDialog().subscribe(()=> {
      this.apiService.getGallery().subscribe((images) => {
        this.gallery.set(images);
      });
    });
  }

  isAdmin() {
    return this.auth.user()?.role === UserRole.ADMIN;
  }

  onDelete(image: string) {
    this.apiService.deleteImage(image).subscribe(() => {
      this.apiService.getGallery().subscribe((images) => {
        this.gallery.set(images);
      });
    });
  }
}

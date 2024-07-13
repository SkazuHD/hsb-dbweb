import {Component, inject, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ApiService} from '../../services/api.service';
import {Image, UserRole} from '@hsb-dbweb/shared';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon, MatIconModule} from '@angular/material/icon';
import {MatDialog, MatDialogClose} from '@angular/material/dialog';
import {AuthService} from '../../services/auth.service';
import {AddPictureComponent} from "../dialog/add-picture/add-picture.component";
import {MatTooltipModule} from "@angular/material/tooltip";

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
    MatTooltipModule,
  ],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.css',
})
export class GalleryComponent implements OnInit {
  apiService = inject(ApiService);
  auth = inject(AuthService)
  private dialog = inject(MatDialog)
  gallery = signal<Image[]>([]);

  ngOnInit(): void {
    this.apiService.getGallery().subscribe((images) => {
      this.gallery.set(images);
    });
  }

  getUrl(image: Image) {
    if (image.imageUid)
      return `http://localhost:4201/api/images/${image.imageUid}`;
    else return image.url;
  }

  updateGallery() {
    this.apiService.getGallery().subscribe((images) => {
      this.gallery.set(images);
    });
  }


  requestAddPictureDialog() {
    this.dialog.open(AddPictureComponent).afterClosed().subscribe(() => {
      this.updateGallery()
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

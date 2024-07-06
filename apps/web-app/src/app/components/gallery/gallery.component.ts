import {Component, inject, model, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ApiService} from '../../services/api.service';
import {Image, UserRole} from '@hsb-dbweb/shared';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon, MatIconModule} from '@angular/material/icon';
import {MatDialog, MatDialogClose} from '@angular/material/dialog';
import {AuthService} from '../../services/auth.service';
import {AddPictureComponent} from "../dialog/add-picture/add-picture.component";

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
  auth = inject(AuthService)
  private dialog = inject(MatDialog)
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

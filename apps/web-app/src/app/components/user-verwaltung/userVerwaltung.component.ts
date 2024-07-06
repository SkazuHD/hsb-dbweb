import { Component, inject, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '@hsb-dbweb/shared';

import { ApiService } from '../../services/api.service';
import { MatButton, MatIconButton } from '@angular/material/button';
import { deleteUser } from 'firebase/auth';

@Component({
  selector: 'app-user-verwaltung',
  standalone: true,
  imports: [CommonModule,
    MatIconButton,
    MatButton,],
  templateUrl: './userVerwaltung.component.html',
  styleUrl: './userVerwaltung.component.css',
})
export class UserVerwaltungComponent {
  user = model.required<User[]>();
  apiService = inject(ApiService);

  ngOnInit(): void {
    this.apiService.getUser().subscribe((user) => {
      this.user.set(user);
    });
  }

  banUser(id:string, activated: boolean){
    if(activated === false){
      activated = true
    }
    else{
      activated = false
    }
    this.apiService.changeUserActivation(id, activated).subscribe(() => {
      this.apiService.getUser().subscribe((users) => {
        this.user.set(users);
      });
    });
  }

  // onDelete(image: string) {
  //   this.apiService.deleteImage(image).subscribe(() => {
  //     this.apiService.getGallery().subscribe((images) => {
  //       this.gallery.set(images);
  //     });
  //   });

  deleteUser(){
    const answer = 1+1
  }
}
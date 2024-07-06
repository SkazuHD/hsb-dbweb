import { Component, inject, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User, UserRole } from '@hsb-dbweb/shared';

import { ApiService } from '../../services/api.service';
import { MatButton, MatIconButton } from '@angular/material/button';

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
  UserRole = UserRole

  ngOnInit(): void {
    this.apiService.getUser().subscribe((user) => {
      this.user.set(user);
    });
  }


  changeUserRole(id:string, role:string){
    if(role === UserRole.ADMIN){
      role = UserRole.USER
    }
    else{
      role = UserRole.ADMIN
    }

    this.apiService.changeUserRole(id, role).subscribe(() => {
      this.apiService.getUser().subscribe((users) => {
        this.user.set(users);
      });
    });
  }

  banUser(id:string, activated: boolean){
      activated = !activated

    this.apiService.changeUserActivation(id, activated).subscribe(() => {
      this.apiService.getUser().subscribe((users) => {
        this.user.set(users);
      });
    });
  }

  deleteUser(id: string){
    this.apiService.deleteUser(id).subscribe(() => {
            this.apiService.getUser().subscribe((users) => {
              this.user.set(users);
          });
        });
      }
}
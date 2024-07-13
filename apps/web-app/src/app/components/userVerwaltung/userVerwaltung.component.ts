import {Component, computed, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserRole} from '@hsb-dbweb/shared';

import {ApiService} from '../../services/api.service';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatCardActions, MatCardContent, MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {NotificationService} from "../../services/notification.service";

@Component({
  selector: 'app-user-verwaltung',
  standalone: true,
  imports: [CommonModule,
    MatIconButton,
    MatButton, MatCardModule, MatCardContent, MatCardActions, MatIconModule],
  templateUrl: './userVerwaltung.component.html',
  styleUrl: './userVerwaltung.component.css',
})
export class UserVerwaltungComponent {
  user = computed(() => this.apiService.users().sort((a, b) => a.username.localeCompare(b.username)));
  private apiService = inject(ApiService);
  private notificationService = inject(NotificationService);
  UserRole = UserRole


  changeUserRole(id: string, role: string) {
    role = role === UserRole.ADMIN ? UserRole.USER : UserRole.ADMIN

    this.apiService.changeUserRole(id, role).subscribe(
      () => {
        this.notificationService.success("Role changed successfully")
      }
    );
  }

  banUser(id: string, activated: boolean) {
    activated = !activated

    this.apiService.changeUserActivation(id, activated).subscribe(
      () => {
        this.notificationService.success("User activation changed successfully")
      }
    )
  }
  

  deleteUser(id: string) {
    this.apiService.deleteUser(id).subscribe((res) => {
      if (res) {
        this.notificationService.success("User deleted successfully")
      }
    });
  }
}

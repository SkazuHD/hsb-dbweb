import {Component, computed, inject, Input, model} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';
import {ApiService} from '../../services/api.service';
import {User} from '@hsb-dbweb/shared';
import {RouterModule} from '@angular/router';
import {AuthService} from "../../services/auth.service";
import {MatIconButton} from "@angular/material/button";

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule,
    MatCardModule,
    MatIcon,
    RouterModule, MatIconButton
  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css',
})
export class ProfilePageComponent {
  private auth: AuthService = inject(AuthService);
  user = model<User>(
    <User>this.auth.user());
  private api: ApiService = inject(ApiService);
  imageUrl = computed(() => {
    if (this.user().imageUid !== undefined && this.user().imageUid !== null)
      return "http://localhost:4201/api/images/" + this.user().imageUid;
    return "http://placeholder.co/150";
  })

  @Input() set uid(uid: string) {
    if (this.auth.user()?.uid === uid) {
      this.user.set(<User>this.auth.user());
      return;
    }
    this.api.getUserById(uid).subscribe((user) => {
      this.user.set(user);

    });
  }

  get isOwnProfile() {
    return this.auth.user()?.uid === this.user().uid;
  }


}


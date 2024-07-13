import {Component, computed, inject, Input, model, signal, WritableSignal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';
import {Router, RouterModule} from '@angular/router';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators,} from '@angular/forms';
import {MatFormField, MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {User} from '@hsb-dbweb/shared';
import {ApiService} from '../../services/api.service';
import {AuthService} from "../../services/auth.service";
import {ImageLoad} from '../../utils/image-load';
import {UploadFileComponent} from "../upload-file/upload-file.component";
import {MatButton} from "@angular/material/button";


@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [CommonModule,
    MatCardModule,
    MatIcon,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatFormField,
    MatInputModule, UploadFileComponent, MatButton

  ],
  templateUrl: './profile-edit.component.html',
  styleUrl: './profile-edit.component.css',
})
export class ProfileEditComponent {


  private auth = inject(AuthService);
  user = model<User>(
    <User>this.auth.user());
  protected profileForm = new FormGroup(
    {
      name: new FormControl(this.user()?.name ?? '', [Validators.required]),
      username: new FormControl(this.user()?.username ?? '', [Validators.required]),
    }
  );
  imageId: WritableSignal<number | undefined> = signal(this.user().imageUid ?? undefined);
  imageUrl = computed(() => {
    if (this.imageId())
      return "http://localhost:4201/api/images/" + this.imageId();
    return "http://placeholder.co/150";
  })
  private router = inject(Router);
  private imageLoad = new ImageLoad();
  private api: ApiService = inject(ApiService);

  @Input() set uid(uid: string) {
    if (this.auth.user()?.uid === uid) {
      this.user.set(<User>this.auth.user());
      return;

    }
  }

  onSave() {
    this.profileForm.markAllAsTouched();
    this.profileForm.updateValueAndValidity()
    if (this.profileForm.invalid) {
      return;
    }


    const credentials: Partial<User> = {
      name: this.profileForm.value.name ?? this.user().name,
      username: this.profileForm.value.username ?? this.user().username,
      imageUid: this.imageId() ?? this.user().imageUid,
    }

    this.api.updateUser(this.user().uid, credentials).subscribe(() => {
      this.auth.refreshTokens().subscribe(() => {
        this.user.set(<User>this.auth.user());
        this.router.navigate(['/profile/' + this.user().uid,]);
      });
    });

  }
}



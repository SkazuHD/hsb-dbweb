import {Component, inject, Input, model} from '@angular/core';
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
import { ImageLoad } from '../../utils/image-load';


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
    MatInputModule

  ],
  templateUrl: './profile-edit.component.html',
  styleUrl: './profile-edit.component.css',
})
export class ProfileEditComponent {


  private auth = inject(AuthService);
  private router = inject(Router);
  private imageLoad = new ImageLoad();
  user = model<User>(
    <User>this.auth.user());
  private api: ApiService = inject(ApiService);
  file: File | undefined = undefined;
  imageUrl = this.imageLoad.imageFromBuffer(this.user().picture.data);


  @Input() set uid(uid: string) {
    if (this.auth.user()?.uid === uid) {
      this.user.set(<User>this.auth.user());
      return;

    }
  }

  protected profileForm = new FormGroup(
    {
      name: new FormControl(this.user()?.name ?? '', [Validators.required]),
      username: new FormControl(this.user()?.username ?? '', [Validators.required]),
    }
  );

  onFileSelected(event: any) {
    this.file = event.target.files[0];
    if (this.file) {
      const reader = this.imageLoad.setImageUrl(this.file);
      reader.onload = (e) => {
        this.imageUrl = reader.result as string;
      }
    }
  }



  onSave() {
    this.profileForm.markAllAsTouched();
    this.profileForm.updateValueAndValidity()
    if (this.profileForm.invalid) {
      return;
    }


    if (this.file) {
      this.imageLoad.setImageUrl(this.file);
    }

    const credentials: Partial<User> = {
      name: this.profileForm.value.name ?? this.user().name,
      username: this.profileForm.value.username ?? this.user().username
    }

    this.api.updateUser(this.user().uid, credentials, this.file).subscribe(() => {
      this.auth.refreshTokens().subscribe(() => {
        this.user.set(<User>this.auth.user());
        this.router.navigate(['/profile/' + this.user().uid,]);
      });
    });

  }
}



import {Component, effect, inject, input, model} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Comment, UserRole} from '@hsb-dbweb/shared';
import {MatCard, MatCardContent, MatCardHeader, MatCardModule} from '@angular/material/card';
import {MarkdownPipe} from '../../../utils/pipes/markdown.pipe';
import {AuthService} from '../../../services/auth.service';
import {MatButton} from '@angular/material/button';
import {ApiService} from '../../../services/api.service';
import {RouterLink} from "@angular/router";
import {ImageLoad} from "../../../utils/image-load";

@Component({
  selector: 'app-single-comment',
  standalone: true,
  imports: [CommonModule, MatCard, MatCardContent, MarkdownPipe, MatCardHeader, MatCardModule, MatButton, RouterLink],
  templateUrl: './single-comment.component.html',
  styleUrl: './single-comment.component.css'
})
export class SingleCommentComponent {
  comment = model.required<Comment | undefined>();
  protected auth: AuthService = inject(AuthService);
  protected api: ApiService = inject(ApiService);
  private imageLoad = new ImageLoad();
  imageUrl2 = input<any>('');

  imageUrlFinal = ''

  constructor() {
    effect(() => {
      //WTF EVERYTHING IS BREAKS WHEN UNRELATED CONSOLE.LOG IS REMOVED
      console.log(this.imageUrl2())
      if (this.comment() && this.comment()?.picture && this.comment()?.picture.data)
        this.imageUrlFinal = this.imageLoad.imageFromBuffer(this.comment()?.picture.data)
      else {
        this.imageUrlFinal = "https://placehold.co/150"
      }
    })
  }

  getProfileRoute() {
    return `/profiles/${this.comment()?.userUid}`;
  }

  onDelete() {
    if (!this.canDelete()) return;
    if (this.comment()?.articleUid && this.comment()?.uid) {
      this.api.deleteComment(this.comment()!.articleUid, this.comment()!.uid).subscribe(
        () => this.comment.set(undefined)
      );
    }
  }

  canDelete() {
    return this.isAdmin() || this.isCommentOwner();
  }

  isCommentOwner() {
    return this.auth.user()?.uid === this.comment()?.userUid;
  }

  isAdmin() {
    return this.auth.user()?.role === UserRole.ADMIN;
  }
}

import { Component, inject, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Comment, UserRole } from '@hsb-dbweb/shared';
import { MatCard, MatCardContent, MatCardHeader, MatCardModule } from '@angular/material/card';
import { MarkdownPipe } from '../../../utils/pipes/markdown.pipe';
import { AuthService } from '../../../services/auth.service';
import { MatButton } from '@angular/material/button';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-single-comment',
  standalone: true,
  imports: [CommonModule, MatCard, MatCardContent, MarkdownPipe, MatCardHeader, MatCardModule, MatButton],
  templateUrl: './single-comment.component.html',
  styleUrl: './single-comment.component.css'
})
export class SingleCommentComponent {
  comment = model.required<Comment | null>();
  protected auth: AuthService = inject(AuthService);
  protected api: ApiService = inject(ApiService);

  onDelete() {
    if (!this.canDelete()) return;
    if (this.comment()?.articleUid && this.comment()?.uid) {
      this.api.deleteComment(this.comment()!.articleUid, this.comment()!.uid).subscribe();
    }
    this.comment.set(null);
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

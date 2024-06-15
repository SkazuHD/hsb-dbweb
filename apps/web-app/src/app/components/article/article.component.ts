import { Component, inject, Input, model } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Article, CommentCreate } from '@hsb-dbweb/shared';
import { MetatagService } from '../../services/metatag.service';
import { MarkdownPipe } from '../../utils/pipes/markdown.pipe';
import { ApiService } from '../../services/api.service';
import { LikeCounterComponent } from '../like-counter/like-counter.component';
import { SingleCommentComponent } from '../comment/single-comment/single-comment.component';
import { MatButton } from '@angular/material/button';
import { MatError, MatFormField, MatHint } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-article',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, MarkdownPipe, LikeCounterComponent, SingleCommentComponent, MatButton, MatError, MatFormField, MatInput, ReactiveFormsModule, MatHint],
  templateUrl: './article.component.html',
  styleUrl: './article.component.css'
})
export class ArticleComponent {
  article = model.required<Article>();
  private meta: MetatagService = inject(MetatagService);
  private api: ApiService = inject(ApiService);
  private auth: AuthService = inject(AuthService);
  commentForm: FormGroup = new FormGroup({
    comment: new FormControl('',
      [Validators.required,
        Validators.minLength(3),
        Validators.maxLength(255)]
    )
  });

  @Input() set slugId(id: string) {
    this.api.getArticleById(id).subscribe((article) => {
      this.article.set(article);
      this.meta.addTagsForArticle(article);
    });
  }

  onLike() {
    this.api.updateArticleLike(this.article().uid).subscribe(() => {
      this.api.getArticleById(this.article().uid).subscribe((article) => {
        this.article.set(article);
      });
    });

  }


  onAddComment() {
    if (this.commentForm.valid) {
      const comment: CommentCreate = {
        content: this.commentForm.get('comment')?.value ?? '',
        articleUid: this.article().uid,
        userUid: this.auth.user()?.uid ?? '0'
      };
      this.api.addArticleComment(this.article().uid, comment).subscribe(
        (comment) => {
          this.commentForm.reset();
          this.api.getArticleById(this.article().uid).subscribe((article) => {
            this.article.set(article);
          });
        }
      );
    }
  }

  onCommentChange($event: any) {
    this.api.getArticleById(this.article().uid).subscribe((article) => {
      this.article.set(article);
    });
  }

  /* TODO GET ARTICLE FROM API BY ID
  ? Route Guard or in ApiService ?
    IF NOT FOUND TRY TO GET ARTICLE BY SLUG
    IF SLUG != ID REDIRECT TO CORRECT URL
    IF NOT FOUND SHOW 404 PAGE */
  isSlugId(value: string): boolean {
    const regex = /^[a-z][a-z0-9-]*[0-9]$/;
    return regex.test(value);
  }

  getSlugFromSlugId(slugId: string): string {
    return slugId.split('-').slice(0, -1).join('-');
  }

  getIdFromSlugId(slugId: string): string {
    return slugId.split('-').pop() ?? '';
  }

}

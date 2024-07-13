import {Component, computed, effect, inject, input, Input, signal} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {Article, Comment, CommentCreate} from '@hsb-dbweb/shared';
import {MarkdownPipe} from '../../utils/pipes/markdown.pipe';
import {ApiService} from '../../services/api.service';
import {LikeCounterComponent} from '../like-counter/like-counter.component';
import {SingleCommentComponent} from '../comment/single-comment/single-comment.component';
import {MatButton} from '@angular/material/button';
import {MatError, MatFormFieldModule, MatHint} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {CdkTextareaAutosize} from "@angular/cdk/text-field";
import {toSignal} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-article',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, MarkdownPipe, LikeCounterComponent, SingleCommentComponent, MatButton, MatError, MatFormFieldModule, MatInput, ReactiveFormsModule, MatHint, CdkTextareaAutosize],
  templateUrl: './article.component.html',
  styleUrl: './article.component.css'
})
export class ArticleComponent {

  @Input() set slugId(id: string) {
    this.uid.set(id);
  }

  preview = input(false);
  previewArticle = input<Article | undefined>(undefined);
  uid = signal('');
  private api: ApiService = inject(ApiService);
  private auth: AuthService = inject(AuthService);

  article = computed(() => {
    if (this.preview()) {
      return this.previewArticle();
    }
    if (this.api.articles()) {
      return this.api.articles()?.find((a) => a.uid === this.uid())
    } else {
      return toSignal(this.api.getArticleById(this.uid()))();
    }

  })
  comments = signal(this.article()?.comments ?? []);

  commentMaxLength = 1000;
  commentForm: FormGroup = new FormGroup({
    comment: new FormControl('',
      [Validators.required,
        Validators.minLength(3),
        Validators.maxLength(this.commentMaxLength)]
    )
  });

  imageUrl = computed(() => {
    if (this.article()?.imageUid)
      return "http://localhost:4201/api/images/" + this.article()?.imageUid;
    return undefined;
  })

  constructor() {
    this.commentForm.valueChanges.subscribe((value) => {
      if (value.comment.length === 0)
        this.commentForm.get('comment')?.setErrors(null);
    });

    effect(() => {
      if (this.preview())
        return;
      if (this.article()?.uid !== undefined)
        this.updateComments();
    })
  }

  onLike() {
    this.api.updateArticleLike(this.uid()).subscribe();

  }

  onAddComment() {
    if (this.commentForm.valid) {
      const comment: CommentCreate = {
        content: this.commentForm.get('comment')?.value ?? '',
        articleUid: this.article()?.uid ?? '',
        userUid: this.auth.user()?.uid ?? '0'
      };
      this.api.addArticleComment(this.article()?.uid ?? '', comment).subscribe(
        (comment) => {
          this.commentForm.reset();
          this.updateComments();
        }
      );
    }
  }

  onCommentChange($event: any) {
    this.updateComments();
  }

  updateComments() {

    this.api.getCommentsByArticleId(this.article()?.uid ?? '').pipe().subscribe((comments: Comment[]) => {
      this.comments.set(comments)
    });
  }


}

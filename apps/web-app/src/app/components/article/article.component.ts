import {Component, computed, inject, input, Input, model, signal} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {Article, Comment, CommentCreate, User} from '@hsb-dbweb/shared';
import {MetatagService} from '../../services/metatag.service';
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
import {map} from "rxjs";
import {ImageLoad} from "../../utils/image-load";

@Component({
  selector: 'app-article',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, MarkdownPipe, LikeCounterComponent, SingleCommentComponent, MatButton, MatError, MatFormFieldModule, MatInput, ReactiveFormsModule, MatHint, CdkTextareaAutosize],
  templateUrl: './article.component.html',
  styleUrl: './article.component.css'
})
export class ArticleComponent {
  article = model.required<Article>();
  comments = signal<Comment[]>([]);
  showComments = input(true);
  private meta: MetatagService = inject(MetatagService);
  private api: ApiService = inject(ApiService);
  private auth: AuthService = inject(AuthService);
  commentMaxLength = 1000;

  userProfileCache = new Map<string, User>()

  commentForm: FormGroup = new FormGroup({
    comment: new FormControl('',
      [Validators.required,
        Validators.minLength(3),
        Validators.maxLength(this.commentMaxLength)]
    )
  });

  @Input() set slugId(id: string) {
    this.api.getArticleById(id).subscribe((article) => {
      this.article.set(article);
      this.meta.addTagsForArticle(article);
      this.updateComments();
    })
  }


  private imageLoad = new ImageLoad();
  imageUrl = computed(() => {
    if (this.article().media === null || this.article().media === undefined)
      return undefined
    else
      return this.imageLoad.imageFromBuffer(this.article().media.data)
  })

  constructor() {
    this.commentForm.valueChanges.subscribe((value) => {
      if (value.comment.length === 0)
        this.commentForm.get('comment')?.setErrors(null);
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
          this.updateComments();
        }
      );
    }
  }

  onCommentChange($event: any) {
    this.updateComments();
  }

  updateComments() {
    this.api.getCommentsByArticleId(this.article().uid).pipe(map((comment) => {
      return comment.map((c) => {
        const commentWithPicture = {
          ...c,
          picture: this.userProfileCache.get(c.userUid)?.picture
        };

        if (!this.userProfileCache.has(c.userUid)) {
          this.api.getUserById(c.userUid).subscribe((user: User) => {
            this.userProfileCache.set(c.userUid, user);
            commentWithPicture.picture = user.picture;
          })
        }
        return commentWithPicture;
      })
    })).subscribe((comments: Comment[]) => {
      this.comments.set(comments);
      console.log("COMMENTS", this.comments())
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

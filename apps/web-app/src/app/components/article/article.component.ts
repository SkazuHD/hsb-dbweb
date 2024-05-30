import {Component, inject, Input, model} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {Article} from '@hsb-dbweb/shared';
import {MetatagService} from '../../services/metatag.service';
import {MarkdownPipe} from "../../utils/pipes/markdown.pipe";
import {ApiService} from "../../services/api.service";
import { LikeCounterComponent } from '../like-counter/like-counter.component';

@Component({
  selector: 'app-article',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, MarkdownPipe, LikeCounterComponent],
  templateUrl: './article.component.html',
  styleUrl: './article.component.css',
})
export class ArticleComponent {
  article = model.required<Article>();
  private meta: MetatagService = inject(MetatagService);
  private api: ApiService = inject(ApiService);

  @Input() set slugId(id: string) {
    this.api.getArticleById(id).subscribe((article) => {
      this.article.set(article);
      this.meta.addTagsForArticle(article);

    });
  }

  onLike() {
    this.api.updateArticleLike(this.article().uid).subscribe(()=>{
      this.api.getArticleById(this.article().uid).subscribe((article) => {
        this.article.set(article);
      });
    })

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

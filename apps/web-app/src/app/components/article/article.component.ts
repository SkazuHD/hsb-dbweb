import {Component, inject, Input, model} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {Article} from '../../../../../../libs/shared/src/lib/types/types';
import {MetatagService} from '../../services/metatag.service';
import {MarkdownPipe} from "../../utils/pipes/markdown.pipe";
import {ApiService} from "../../services/api.service";

@Component({
  selector: 'app-article',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, MarkdownPipe],
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

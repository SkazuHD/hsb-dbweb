import { Component, inject, Input, model, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Article } from '../../utils/types/types';
import { MetatagService } from '../../services/metatag.service';

@Component({
  selector: 'app-article',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './article.component.html',
  styleUrl: './article.component.css',
})
export class ArticleComponent implements OnInit {
  @Input() slugId = '';
  private meta: MetatagService = inject(MetatagService);
  article = model.required<Article>();

  ngOnInit(): void {
    if (!this.article()) {
      this.article.set({
        title: 'CALL API TO GET ARTICLE',
        content: 'IMPLEMENT ME',
        id: this.slugId,
      });
    }
    this.meta.addTagsForArticle(this.article());
  }

  /* TODO GET ARTICLE FROM API BY ID
  ? Route Guard ?
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

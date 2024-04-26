import { inject, Injectable, OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { Article } from '../types/types';

@Injectable({
  providedIn: 'root',
})
export class MetatagService implements OnInit {
  private meta: Meta = inject(Meta);

  ngOnInit(): void {}

  addTagsForArticle(article: Article): void {
    const tags = [
      {
        name: 'author',
        content: article.author ?? 'Unknown Author',
      },
      {
        name: 'description',
        content: article.content ?? article.subtitle,
      },
      {
        name: 'keywords',
        content: this.generateKeywords(article),
      },
      {
        name: 'og:title',
        content: article.title,
      },
      {
        name: 'og:type',
        content: 'article',
      },
      {
        name: 'og:description',
        content: article.content,
      },
      {
        name: 'og:image',
        content: article.image?.url ?? '',
      },
      {
        name: 'og:url',
        content: window.location.href,
      },
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
    ];

    tags.forEach((tag) => this.meta.updateTag(tag));
  }
  private generateKeywords(article: Article): string {
    return [
      article?.title,
      article?.author,
      article?.date,
      article?.subtitle,
    ].join(', ');
  }
}

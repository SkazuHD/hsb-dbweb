import { Component, inject, input, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Article } from '../types/types';
import { MetatagService } from '../services/metatag.service';

@Component({
  selector: 'app-article',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './article.component.html',
  styleUrl: './article.component.css',
})
export class ArticleComponent implements OnInit {
  private meta: MetatagService = inject(MetatagService);
  article = input.required<Article>();

  ngOnInit(): void {
    this.meta.addTagsForArticle(this.article());
    this.meta.addTagsForArticle({
      title: 'My Article',
      content: 'This is my article',
      id: '123',
    });
  }
}

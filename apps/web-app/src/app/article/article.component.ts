import { Component, input } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Article } from '../types/types';

@Component({
  selector: 'app-article',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './article.component.html',
  styleUrl: './article.component.css',
})
export class ArticleComponent {
  article = input.required<Article>();
}

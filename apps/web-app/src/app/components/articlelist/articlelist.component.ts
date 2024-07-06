import {Component, computed, inject, input, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButton} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {RouterModule} from '@angular/router';
import {ApiService} from '../../services/api.service';
import {NewsfeedComponent} from '../newsfeed/newsfeed.component';
import {SearchFieldComponent} from "../search/search-field.component";

@Component({
  selector: 'app-articlelist',
  standalone: true,
  imports: [
    CommonModule,
    MatButton,
    MatCardModule,
    RouterModule,
    NewsfeedComponent,
    SearchFieldComponent,
  ],
  templateUrl: './articlelist.component.html',
  styleUrl: './articlelist.component.css',
})
export class ArticlelistComponent implements OnInit {
  apiService: ApiService = inject(ApiService);
  articles = computed(() => this.apiService.articles());
  title = input<string>('Neuigkeiten');
  limit = input<number>(3);
  filterString = signal<string>('');
  articleList = computed(() => {
    const now = new Date();
    const articles = this.articles();
    const filteredArticles = articles.filter(article => {
      const articleDate = new Date(article.date ?? '');
      return articleDate <= now;
    });

    if (this.limit() === 0) return filteredArticles;
    return filteredArticles.slice(0, this.limit());
  });
  filteredArticles = computed(() => {
    const filterString = this.filterString().toLowerCase();
    return this.articleList().filter(article => {
      return article.title.toLowerCase().includes(filterString) || article.content.toLowerCase().includes(filterString);
    });
  })

  ngOnInit() {
    if (this.articles()?.length > 0) return;

  }
}

import {Component, computed, inject, input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButton} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {RouterModule} from '@angular/router';
import {ApiService} from '../../services/api.service';
import {NewsfeedComponent} from '../newsfeed/newsfeed.component';

@Component({
  selector: 'app-articlelist',
  standalone: true,
  imports: [
    CommonModule,
    MatButton,
    MatCardModule,
    RouterModule,
    NewsfeedComponent,
  ],
  templateUrl: './articlelist.component.html',
  styleUrl: './articlelist.component.css',
})
export class ArticlelistComponent implements OnInit {
  apiService: ApiService = inject(ApiService);
  articles = computed(() => this.apiService.articles());
  title = input<string>('Neuigkeiten');
  limit = input<number>(3);
  articleList = computed(() => {
    if (this.limit() === 0) return this.articles();
    return this.articles()?.slice(0, this.limit())
  });

  ngOnInit() {
    if (this.articles()?.length > 0) return;

  }
}

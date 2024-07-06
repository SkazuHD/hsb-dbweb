import {Component, computed, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AppShellComponent} from '../app-shell/app-shell';
import {MatTab, MatTabContent, MatTabGroup, MatTabLabel,} from '@angular/material/tabs';
import {ApiService} from '../services/api.service';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatCard, MatCardActions, MatCardContent, MatCardModule, MatCardTitleGroup,} from '@angular/material/card';
import {Observable, of} from 'rxjs';
import {Article, Event, User} from '@hsb-dbweb/shared';
import {ArticleService} from '../services/article.service';
import {EventService} from '../services/event.service';
import {MarkdownPipe} from "../utils/pipes/markdown.pipe";

export interface Tab {
  label: string;
  content: string;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    AppShellComponent,
    MatTabGroup,
    MatTab,
    MatTabLabel,
    MatTabContent,
    MatButton,
    MatIconButton,
    MatIcon,
    MatCard,
    MatCardContent,
    MatCardActions,
    MatCardTitleGroup,
    MatCardModule,
    MarkdownPipe,
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent {
  api = inject(ApiService);
  eventService = inject(EventService);
  articleService = inject(ArticleService);
  articles = computed(() => this.api.articles())
  users$: Observable<User[]> = of([]);
  events = computed(() => {
    return this.api.events()
      .map(event => {
        event.date = new Date(event.date)
        return event
      }).sort((a, b) => a.date.getTime() - b.date.getTime())
  });

  onAddArticle() {
    this.articleService.requestAddArticleDialog().subscribe(() => {

    });
  }

  onDeleteArticle(article: Article) {
    this.articleService.deleteArticle(article.uid).subscribe(() => {
    });
  }

  onEditArticle(article: Article) {
    this.articleService.requestEditArticleDialog(article).subscribe(() => {
    });
  }

  onAddEvent() {
    this.eventService.requestAddEventDialog().subscribe(() => {
    });
  }

  onDeleteEvent(event: Event) {
    this.eventService.deleteEvent(event.uid).subscribe(() => {
    });
  }

  onEditEvent(event: Event) {
    this.eventService.requestEditEventDialog(event).subscribe(() => {
    });
  }
}

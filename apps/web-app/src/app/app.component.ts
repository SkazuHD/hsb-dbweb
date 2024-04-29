import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ApiServiceService } from './services/api-service.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AppShellComponent } from './app-shell/app-shell';
import { ArticleComponent } from './article/article.component';
import { ContactComponent } from './contact/contact.component';
import {MarkdownPlaygroundComponent} from "./markdown-playground/markdown-playground.component";

@Component({
  standalone: true,
  imports: [
    RouterModule,
    ArticleComponent,
    AppShellComponent,
    MarkdownPlaygroundComponent,
    ContactComponent,
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  apiService = inject(ApiServiceService);
  title = 'hsb-dbweb';
  constructor() {
    this.apiService.events$.pipe(takeUntilDestroyed()).subscribe((event) => {
      console.log(JSON.parse(event.data));
    });
  }
}

import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ApiServiceService } from './services/api-service.service';
import { AppShellComponent } from './app-shell/app-shell';
import { ArticleComponent } from './article/article.component';

@Component({
  standalone: true,
  imports: [ RouterModule, ArticleComponent, AppShellComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  apiService = inject(ApiServiceService);
  title = 'hsb-dbweb';
}

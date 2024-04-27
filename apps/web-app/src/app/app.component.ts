import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ApiServiceService } from './services/api-service.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AppShellComponent } from './app-shell/app-shell';
import { InfoPageComponent } from './components/infopage/info-page.component';

@Component({
  standalone: true,
  imports: [RouterModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private apiService = inject(ApiService);
  title = 'hsb-dbweb';

  constructor() {
    this.apiService.testApi();

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      if (storedTheme === 'dark') {
        document.body.classList.add('dark');
      }
    } else if (prefersDark.matches) {
      document.body.classList.add('dark');
    }
  }
}

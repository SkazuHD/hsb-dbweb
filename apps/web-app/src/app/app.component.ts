import {Component, inject} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ApiServiceService} from './services/api-service.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {AppShellComponent} from './app-shell/app-shell';
import {InfoPageComponent} from "./components/infopage/info-page.component";

@Component({
  standalone: true,
  imports: [RouterModule, AppShellComponent, InfoPageComponent],
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

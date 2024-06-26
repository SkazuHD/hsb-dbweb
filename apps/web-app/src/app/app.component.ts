import {Component, inject} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ApiService} from "./services/api.service";
import {registerLocaleData} from "@angular/common";
import * as de from '@angular/common/locales/de';


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
    registerLocaleData(de.default, 'de-DE')
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

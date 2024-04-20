import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ApiServiceService } from './services/api-service.service';
import { AppShellComponent } from './app-shell/app-shell';

@Component({
  standalone: true,
  imports: [RouterModule, AppShellComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  apiService = inject(ApiServiceService);
  title = 'hsb-dbweb';
}

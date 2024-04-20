import {Component, inject} from '@angular/core';
import { RouterModule } from '@angular/router';
import {ApiServiceService} from "./services/api-service.service";

@Component({
  standalone: true,
  imports: [ RouterModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  apiService = inject(ApiServiceService);
  title = 'hsb-dbweb';
}

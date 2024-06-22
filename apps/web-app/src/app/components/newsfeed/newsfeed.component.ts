import { Component, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Article } from '@hsb-dbweb/shared';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-newsfeed',
  standalone: true,
  imports: [CommonModule, MatButton, MatCardModule, RouterModule],
  templateUrl: './newsfeed.component.html',
  styleUrl: './newsfeed.component.css',
})
export class NewsfeedComponent {
  article = model.required<Article>(); // Article as Input
}

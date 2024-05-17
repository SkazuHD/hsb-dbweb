import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-newsfeed',
  standalone: true,
  imports: [CommonModule, MatButton, MatCardModule],
  templateUrl: './newsfeed.component.html',
  styleUrl: './newsfeed.component.css',
})
export class NewsfeedComponent {}

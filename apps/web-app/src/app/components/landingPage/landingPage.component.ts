import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { NewsfeedComponent } from '../newsFeed/newsfeed.component';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, MatButton, MatCard, NewsfeedComponent],
  templateUrl: './landingPage.component.html',
  styleUrl: './landingPage.component.css',
})
export class LandingPageComponent {}

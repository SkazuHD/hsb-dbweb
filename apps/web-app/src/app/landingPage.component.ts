import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { NewsfeedComponent } from './newsfeed.component';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, MatButton, NewsfeedComponent],
  templateUrl: './landingPage.component.html',
  styleUrl: './landingPage.component.css',
})
export class LandingPageComponent {}

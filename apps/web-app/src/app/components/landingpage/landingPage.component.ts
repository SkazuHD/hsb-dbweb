import { Component, inject, model, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { NewsfeedComponent } from '../newsfeed/newsfeed.component';
import { ApiService } from '../../services/api.service';
import { Article, Image } from '@hsb-dbweb/shared';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, MatButton, MatCard, NewsfeedComponent, RouterModule],
  templateUrl: './landingPage.component.html',
  styleUrl: './landingPage.component.css',
})
export class LandingPageComponent implements OnInit {
  apiService: ApiService = inject(ApiService);
  articles = model<Article[]>();
  landingpageimage: Image = {
    url: 'https://tv.orf.at/program/orf1/kungfupanda-aufmach100~_v-epg__large__16__9_-5412e775eb65789c908def5fa9fdf24a7b895a8f.jpg',
    alt: 'Decription of the image',
  };
  landingpagetext = 'Hier Abouttext einfügen';

  ngOnInit() {
    this.apiService.getArticles().subscribe((articles) => {
      this.articles.set(articles);
    });
  }
}

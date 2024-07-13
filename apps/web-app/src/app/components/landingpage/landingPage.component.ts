import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButton} from '@angular/material/button';
import {MatCard} from '@angular/material/card';
import {NewsfeedComponent} from '../newsfeed/newsfeed.component';
import {Image} from '@hsb-dbweb/shared';
import {RouterModule} from '@angular/router';
import {ArticlelistComponent} from "../articlelist/articlelist.component";

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, MatButton, MatCard, NewsfeedComponent, RouterModule, ArticlelistComponent],
  templateUrl: './landingPage.component.html',
  styleUrl: './landingPage.component.css',
})
export class LandingPageComponent {

  landingpageimage: Image = {
    url: 'https://tv.orf.at/program/orf1/kungfupanda-aufmach100~_v-epg__large__16__9_-5412e775eb65789c908def5fa9fdf24a7b895a8f.jpg',
    alt: 'Decription of the image',
  };
  landingpagetext = 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.';


}

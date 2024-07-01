import {Component, computed, model} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButton} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {Article} from '@hsb-dbweb/shared';
import {RouterModule} from '@angular/router';
import {MarkdownPipe} from "../../utils/pipes/markdown.pipe";
import {ImageLoad} from "../../utils/image-load";

@Component({
  selector: 'app-newsfeed',
  standalone: true,
  imports: [CommonModule, MatButton, MatCardModule, RouterModule, MarkdownPipe],
  templateUrl: './newsfeed.component.html',
  styleUrl: './newsfeed.component.css',
})
export class NewsfeedComponent {
  article = model.required<Article>(); // Article as Input

  private imageLoad = new ImageLoad();
  imageUrl = computed(() => {
    if (this.article()?.imageUid !== undefined)
      return "http://localhost:4201/api/images/" + this.article()?.imageUid;
    return undefined;
  })

}

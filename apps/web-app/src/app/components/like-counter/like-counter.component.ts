import {Component, model} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from '@angular/material/button'

@Component({
  selector: 'app-like-counter',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './like-counter.component.html',
  styleUrl: './like-counter.component.css',
})
export class LikeCounterComponent {
  likes = model(0);
  isLiked = model(false);

  constructor() {
    setInterval(() => {
      this.likes.set(Math.round(Math.random() * 100));
    }, 3000);
  }

  onClick() {
    this.isLiked.set(!this.isLiked());
    this.likes.set(this.likes() + (this.isLiked() ? 1 : -1));
  }
}

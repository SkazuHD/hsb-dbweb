import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MarkdownPlaygroundComponent} from "./markdown-playground/markdown-playground.component";
import {LikeCounterComponent} from "../components/like-counter/like-counter.component";

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [CommonModule, MarkdownPlaygroundComponent, LikeCounterComponent],
  templateUrl: './demo.component.html',
  styleUrl: './demo.component.css',
})
export class DemoComponent {
}

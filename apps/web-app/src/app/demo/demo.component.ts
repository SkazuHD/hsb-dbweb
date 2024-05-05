import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MarkdownPlaygroundComponent} from "./markdown-playground/markdown-playground.component";
import {LikeCounterComponent} from "../components/like-counter/like-counter.component";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatDividerModule} from "@angular/material/divider";

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [CommonModule, MarkdownPlaygroundComponent, LikeCounterComponent, MatSlideToggleModule, MatIconModule, MatButtonModule, MatDividerModule],
  templateUrl: './demo.component.html',
  styleUrl: './demo.component.css',
})
export class DemoComponent {
}

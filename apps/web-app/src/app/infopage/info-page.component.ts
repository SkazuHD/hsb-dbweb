import { Component, input} from '@angular/core';
import { CommonModule } from '@angular/common';
import  { InfoText } from '../types/types';
import { NgFor } from '@angular/common';
import { MarkdownPipe } from "../pipes/markdown.pipe";

@Component({
    selector: 'app-info-page',
    standalone: true,
    templateUrl: './info-page.component.html',
    styleUrl: './info-page.component.css',
    imports: [CommonModule, NgFor, MarkdownPipe]
})
export class InfoPageComponent {
  infotext = input.required<InfoText>();
}

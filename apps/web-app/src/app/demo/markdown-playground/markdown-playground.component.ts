import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MarkdownPipe } from '../../utils/pipes/markdown.pipe';

@Component({
  selector: 'app-markdown-playground',
  standalone: true,
  imports: [CommonModule, MatFormField, MatInput, MarkdownPipe, MatLabel],
  templateUrl: './markdown-playground.component.html',
  styleUrl: './markdown-playground.component.css',
})
export class MarkdownPlaygroundComponent {}

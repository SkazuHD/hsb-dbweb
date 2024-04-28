import { Pipe, PipeTransform } from '@angular/core';
import { marked } from 'marked';

@Pipe({
  name: 'markdown',
  standalone: true,
})
export class MarkdownPipe implements PipeTransform {
  transform(content: string, ...args: unknown[]): unknown {
    const parsed = marked.parse(
      content.replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/, ''),
    );
    return `<div class="markdown">${parsed}</div>`;
  }
}

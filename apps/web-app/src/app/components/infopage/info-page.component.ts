import {Component, inject, Input, model} from '@angular/core';
import {CommonModule, NgFor} from '@angular/common';
import {MarkdownPipe} from "../../utils/pipes/markdown.pipe";
import {InfoText} from "../../../../../../libs/shared/src/lib/types/types";
import {ApiService} from "../../services/api.service";

@Component({
  selector: 'app-info-page',
  standalone: true,
  templateUrl: './info-page.component.html',
  styleUrl: './info-page.component.css',
  imports: [CommonModule, NgFor, MarkdownPipe]
})
export class InfoPageComponent {

  infotext = model.required<InfoText>();
  private apiService = inject(ApiService);

  @Input() set id(id: string) {
    this.apiService.getInfo(id).subscribe((info) => {
      this.infotext.set(info)
    });
  }


}

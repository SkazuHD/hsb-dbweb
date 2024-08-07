import {Component, inject, Input, model} from '@angular/core';
import {CommonModule, NgFor} from '@angular/common';
import {MarkdownPipe} from "../../utils/pipes/markdown.pipe";
import {InfoText} from '@hsb-dbweb/shared';
import {ApiService} from "../../services/api.service";
import {GalleryComponent} from "../gallery/gallery.component";

@Component({
  selector: 'app-info-page',
  standalone: true,
  templateUrl: './info-page.component.html',
  styleUrl: './info-page.component.css',
  imports: [CommonModule, NgFor, MarkdownPipe, GalleryComponent]
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

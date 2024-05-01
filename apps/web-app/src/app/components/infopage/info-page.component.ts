import {Component, inject, model, OnInit} from '@angular/core';
import {CommonModule, NgFor} from '@angular/common';
import {MarkdownPipe} from "../../utils/pipes/markdown.pipe";
import {InfoText} from "../../utils/types/types";
import {ApiServiceService} from "../../services/api-service.service";

@Component({
  selector: 'app-info-page',
  standalone: true,
  templateUrl: './info-page.component.html',
  styleUrl: './info-page.component.css',
  imports: [CommonModule, NgFor, MarkdownPipe]
})
export class InfoPageComponent implements OnInit {
  apiService = inject(ApiServiceService);
  infotext = model.required<InfoText>();

  ngOnInit(): void {
    this.apiService.getInfo('1').subscribe((info) => {
      console.log(info);
      this.infotext.set(info)
    });
  }


}

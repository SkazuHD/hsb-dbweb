import {Component, input} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {MatListItem, MatNavList} from "@angular/material/list";
import {MatToolbar} from "@angular/material/toolbar";
import {RouterLink} from "@angular/router";
import {AppLink} from "../../../../../libs/shared/src/lib/types/types";
import {MatSidenav} from "@angular/material/sidenav";

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [CommonModule, MatIcon, MatIconButton, MatListItem, MatNavList, MatToolbar, NgOptimizedImage, RouterLink],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.css',
})
export class ToolbarComponent {
  links = input<AppLink[]>();
  sideNav = input<MatSidenav>();
}

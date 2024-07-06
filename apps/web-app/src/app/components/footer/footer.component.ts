import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatIcon} from "@angular/material/icon";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, MatIcon, RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {

  title = 'HSB-DBWEB'

  links = [
    {path: '/articles', title: 'Artikel'},
    {path: '/events', title: 'Events'},
    {path: '/contact', title: 'Kontakt'},
    {path: '/info', title: 'Info'}
  ]

  get currentYear() {
    return new Date().getFullYear();
  }
}

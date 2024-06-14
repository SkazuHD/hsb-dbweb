import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AppShellComponent} from "../app-shell/app-shell";
import {MatTab, MatTabContent, MatTabGroup, MatTabLabel} from "@angular/material/tabs";
import {ApiService} from "../services/api.service";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatCard, MatCardActions, MatCardContent, MatCardModule, MatCardTitleGroup} from '@angular/material/card';
import {Observable, of} from "rxjs";
import {Event, User} from "@hsb-dbweb/shared";
import {EventService} from "../services/event.service";

export interface Tab {
  label: string;
  content: string;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, AppShellComponent, MatTabGroup, MatTab, MatTabLabel, MatTabContent, MatButton, MatIconButton, MatIcon, MatCard, MatCardContent, MatCardActions, MatCardTitleGroup, MatCardModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent {
  api = inject(ApiService);
  eventService = inject(EventService);
  articles$ = this.api.getArticles();
  users$: Observable<User[]> = of([]);
  events$ = this.eventService.getAllEvents();

  onAddEvent() {
    this.eventService.requestAddEventDialog().subscribe(() => {
      this.events$ = this.eventService.getAllEvents();
    });
  }

  onDeleteEvent(event: Event) {
    this.eventService.deleteEvent(event.uid).subscribe(() => {
      this.events$ = this.eventService.getAllEvents();
    });
  }

  onEditEvent(event: Event) {
    this.eventService.requestEditEventDialog(event).subscribe(() => {
      this.events$ = this.eventService.getAllEvents();
    });
  }
}


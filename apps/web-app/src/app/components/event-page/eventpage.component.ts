import {Component, computed, inject, signal, WritableSignal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CalendarComponent} from "../calendar/calendar.component";
import {Event} from "@hsb-dbweb/shared";
import {MatList, MatListItem} from "@angular/material/list";
import {MatCard, MatCardContent, MatCardModule, MatCardTitleGroup} from "@angular/material/card";
import {ApiService} from "../../services/api.service";

@Component({
  selector: 'app-eventpage',
  standalone: true,
  imports: [CommonModule, CalendarComponent, MatListItem, MatList, MatCard, MatCardTitleGroup, MatCardContent, MatCardModule],
  templateUrl: './eventpage.component.html',
  styleUrl: './eventpage.component.css',
})
export class EventpageComponent {

  events = computed(() => {
    return this.api.events()
      .map(event => {
        event.date = new Date(event.date)
        return event
      }).sort((a, b) => a.date.getTime() - b.date.getTime())
  });
  upcomingEvents = computed(() => this.getUpcomingEvents(5));
  selectedEvent: WritableSignal<Event | undefined> = signal(undefined);
  private api = inject(ApiService)

  getUpcomingEvents(count: number): Event[] {
    return this.events().filter(event => event.date >= new Date()).slice(0, count)
  }
}

import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CalendarComponent} from "../calendar/calendar.component";
import {Event} from "@hsb-dbweb/shared";
import {EventService} from "../../services/event.service";
import {MatList, MatListItem} from "@angular/material/list";
import {MatCard, MatCardContent, MatCardModule, MatCardTitleGroup} from "@angular/material/card";

@Component({
  selector: 'app-eventpage',
  standalone: true,
  imports: [CommonModule, CalendarComponent, MatListItem, MatList, MatCard, MatCardTitleGroup, MatCardContent, MatCardModule],
  templateUrl: './eventpage.component.html',
  styleUrl: './eventpage.component.css',
})
export class EventpageComponent implements OnInit {

  events: Event[] = []
  selectedEvent: Event | undefined;
  eventSReady = false;
  private eventService: EventService = inject(EventService);

  newSelectedEvent(event: Event | undefined) {
    this.selectedEvent = event;
  }

  ngOnInit(): void {
    this.eventService.getAllEvents().subscribe(events => {
      events.map(event => {
        event.date = new Date(event.date)
        this.events.push(event)
      })
      this.eventSReady = true;
    })
  }

  getUpcomingEvents(count: number): Event[] {
    return this.events.filter(event => event.date >= new Date()).slice(0, count)
  }
}

import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MarkdownPlaygroundComponent} from './markdown-playground/markdown-playground.component';
import {LikeCounterComponent} from '../components/like-counter/like-counter.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider';
import {MatCardModule} from '@angular/material/card';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {CalendarComponent} from '../components/calendar/calendar.component';
import {Event, EventType} from '@hsb-dbweb/shared';
import {UploadFileComponent} from '../components/upload-file/upload-file.component';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [CommonModule, MarkdownPlaygroundComponent, LikeCounterComponent, MatSlideToggleModule, MatIconModule, MatButtonModule, MatDividerModule, MatCardModule, MatDatepickerModule, CalendarComponent, UploadFileComponent],
  templateUrl: './demo.component.html',
  styleUrl: './demo.component.css'
})
export class DemoComponent {
  events: Event[] = [
    {
      uid: 'E-1234',
      title: 'Event 1',
      date: new Date('2024-10-10T14:48:00'),
      location: 'Location 1',
      description: 'Description 1',
      type: EventType.Event
    }
  ];
  selectedEvent: Event | undefined;

  newSelectedEvent(event: Event | undefined) {
    this.selectedEvent = event;
  }

  protected readonly alert = alert;
}

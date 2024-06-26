import {inject, Injectable} from '@angular/core';
import {ApiService} from "./api.service";
import {Event} from "@hsb-dbweb/shared";
import {MatDialog} from "@angular/material/dialog";
import {EditEventComponent} from "../components/dialog/edit-event/editEvent.component";
import {NotificationService} from "./notification.service";
import {AddEventComponent} from '../components/dialog/add-event/addEvent.component';
import {tap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private dialog = inject(MatDialog);
  private apiService = inject(ApiService);
  private notificationService = inject(NotificationService);


  requestEditEventDialog(event: Event) {
    return this.dialog.open(EditEventComponent, {
      data: event,
      width: '800px',
      maxWidth: '100%',
    }).afterClosed().pipe(
      tap((result: Event) => {
          if (result) {
            this.updateEvent(result).subscribe(() => {
              this.notificationService.success('Event updated successfully');
            });
          }
        }
      ));
  }

  requestAddEventDialog() {
    return this.dialog.open(AddEventComponent, {
      width: '800px',
      maxWidth: '100%',
    }).afterClosed().pipe(
      tap((result: Event) => {
        if (result) {
          this.createEvent(result).subscribe(() => {
            this.notificationService.success('Event created successfully');
          });
        }
      })
    );
  }


  getAllEvents() {
    return this.apiService.getAllEvents();
  }

  getEventById(id: string) {
    return this.apiService.getEventById(id);
  }

  getEventsByType(type: Event["type"]) {
    return this.apiService.getEventsByType(type);
  }

  getEventsByDate(date: Date) {
    return this.apiService.getEventsByDate(date);
  }

  getEventsByLocation(location: string) {
    return this.apiService.getEventsByLocation(location);
  }

  getUpcomingEvents(range: number) {
    return this.apiService.getUpcomingEvents(range);
  }

  createEvent(event: Event) {
    return this.apiService.createEvent(event);
  }

  updateEvent(event: Partial<Event>) {
    return this.apiService.updateEvent(event);
  }

  deleteEvent(id: string) {
    return this.apiService.deleteEvent(id);
  }
}

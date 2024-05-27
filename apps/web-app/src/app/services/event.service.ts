import {Injectable} from '@angular/core';
import {ApiService} from "./api.service";
import {Event} from "@hsb-dbweb/shared";

@Injectable({
  providedIn: 'root'
})
export class EventService {
  constructor(private apiService: ApiService) {
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

  updateEvent(event: Event) {
    return this.apiService.updateEvent(event);
  }

  deleteEvent(id: string) {
    return this.apiService.deleteEvent(id);
  }
}

import {Component, input, model} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DateRange, MatCalendar, MatCalendarCellCssClasses, MatDatepickerModule} from "@angular/material/datepicker";
import {MatCard} from "@angular/material/card";
import {MatNativeDateModule} from "@angular/material/core";
import {Event} from '@hsb-dbweb/shared';
import {ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, MatCalendar, MatCard, MatDatepickerModule, MatNativeDateModule, ReactiveFormsModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
})
export class CalendarComponent {
  selected: Date | DateRange<Date> | null;
  events = input.required<Event[]>();
  public selectedDate = model<Event | undefined>()


  onSelectionChange(date: Date | null) {
    if (!date) return;
    const event = this.events().find(event => this.compareDates(event.date, date))
    this.selectedDate.set(event);
  }

  dateClass() {
    return (date: Date): MatCalendarCellCssClasses => {
      if (this.events()?.length === 0) return '';

      const event = this.events().find(event => this.compareDates(event.date, date))
      if (event) {
        return ['date-highlight', event.type.toLowerCase()];
      } else {
        return '';
      }
    };

  }

  private compareDates(date1: Date, date2: Date): boolean {
    return (date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate());
  }
}

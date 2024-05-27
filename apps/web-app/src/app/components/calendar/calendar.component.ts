import {Component, input, output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DateRange, MatCalendar, MatCalendarCellCssClasses, MatDatepickerModule} from "@angular/material/datepicker";
import {MatCard} from "@angular/material/card";
import {MatNativeDateModule} from "@angular/material/core";
import {Event} from "../../utils/types/types";
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
  events = input<Event[]>([]);
  public selectedDate = output<Event | undefined>()


  onSelectionChange(date: Date | null) {
    if (!date) return;
    const event = this.events().find(event => this.compareDates(event.dateTime, date))
    this.selectedDate.emit(event);
  }

  dateClass() {
    return (date: Date): MatCalendarCellCssClasses => {

      const event = this.events().find(event => this.compareDates(event.dateTime, date))
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

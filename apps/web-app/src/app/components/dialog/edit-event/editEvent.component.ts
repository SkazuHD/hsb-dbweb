import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButton, MatIconButton} from "@angular/material/button";
import {
  MAT_DIALOG_DATA,
  MatDialogClose,
  MatDialogContainer,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {Event, EventType} from "@hsb-dbweb/shared";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";

@Component({
  selector: 'app-edit-event',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButton, MatDialogClose, MatDialogContent, MatDialogTitle, MatError, MatFormField, MatIcon, MatIconButton, MatInput, ReactiveFormsModule, MatLabel, MatOption, MatSelect, MatDialogContainer],
  templateUrl: './editEvent.component.html',
  styleUrl: './editEvent.component.scss',
})
export class EditEventComponent {

  event: Event = inject(MAT_DIALOG_DATA);
  date = new Date(this.event.date);
  dateTimeLocalValue = (new Date(this.date.getTime() - this.date.getTimezoneOffset() * 60000).toISOString()).slice(0, -1);

  editEventForm: FormGroup = new FormGroup({
    title: new FormControl(this.event.title, [Validators.required]),
    description: new FormControl(this.event.description, [Validators.required]),
    date: new FormControl(this.dateTimeLocalValue, [Validators.required]),
    location: new FormControl(this.event.location, [Validators.required]),
    type: new FormControl(this.event.type, [Validators.required]),
  })
  protected readonly EventType = EventType;
  protected readonly Object = Object;
  private dialog = inject(MatDialogRef);

  onSaveEvent() {

    const date = new Date(this.editEventForm.get('date')?.value ?? this.event.date);
    date.setHours(date.getHours() + date.getTimezoneOffset() / 60)

    const updatedEvent: Event = {
      uid: this.event.uid,
      date: date,
      ...this.editEventForm.value
    };
    console.debug('Before update:', this.event)
    console.debug('Updated event:', updatedEvent)
    this.dialog.close(updatedEvent);
  }
}

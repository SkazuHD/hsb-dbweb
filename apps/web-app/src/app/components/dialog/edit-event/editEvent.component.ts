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
  date = this.event.date.toString().split('.')[0].substring(0, this.event.date.toString().split('.')[0].length - 3)
  editEventForm: FormGroup = new FormGroup({
    title: new FormControl(this.event.title, [Validators.required]),
    description: new FormControl(this.event.description, [Validators.required]),
    date: new FormControl(this.date, [Validators.required]),
    location: new FormControl(this.event.location, [Validators.required]),
    type: new FormControl(this.event.type, [Validators.required]),
  })
  protected readonly EventType = EventType;
  protected readonly Object = Object;
  private dialog = inject(MatDialogRef);

  onSaveEvent() {
    const updatedEvent: Event = {
      uid: this.event.uid,
      ...this.editEventForm.value
    };
    this.dialog.close(updatedEvent);
  }
}

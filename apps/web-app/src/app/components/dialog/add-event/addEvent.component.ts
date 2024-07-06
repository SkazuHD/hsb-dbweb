import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButton, MatIconButton} from "@angular/material/button";
import {
  MatDialogClose,
  MatDialogContainer,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatError, MatFormField, MatFormFieldModule, MatLabel} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {Event, EventType} from "@hsb-dbweb/shared";
import {MatOption, MatSelect} from "@angular/material/select";

@Component({
  selector: 'app-edit-event',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButton, MatDialogClose, MatDialogContent, MatDialogTitle, MatError, MatFormField, MatIcon, MatIconButton, MatInput, ReactiveFormsModule, MatSelect, MatOption, MatFormFieldModule, MatLabel, MatDialogContainer],
  templateUrl: './addEvent.component.html',
  styleUrl: './addEvent.component.scss',
})
export class AddEventComponent {

  date = new Date().toISOString().split('.')[0].substring(0, new Date().toISOString().split('.')[0].length - 3)

  addEventForm: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    date: new FormControl(this.date, [Validators.required]),
    location: new FormControl('', [Validators.required]),
    type: new FormControl(EventType.Event, [Validators.required]),
  })
  protected readonly = EventType;
  protected readonly Object = Object;
  protected readonly EventType = EventType;
  private dialog = inject(MatDialogRef);

  onSaveEvent() {
    if (this.addEventForm.invalid) return;
    const updatedEvent: Event = {
      ...this.addEventForm.value
    };
    this.dialog.close(updatedEvent);
  }
}

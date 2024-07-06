import {Component, model} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatIconButton} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-search-field',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatIconButton, MatIconModule, ReactiveFormsModule],
  templateUrl: './search-field.component.html',
  styleUrl: './search-field.component.css',
})
export class SearchFieldComponent {
  searchString = model('');

  searchFormGroup = new FormGroup(
    {
      searchString: new FormControl(this.searchString()),
    }
  )

  constructor() {
    this.searchFormGroup.valueChanges.subscribe((value) => {
      this.searchString.set(value.searchString ?? '');
    });
  }
}

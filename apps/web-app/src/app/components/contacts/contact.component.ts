import {Component, inject, model, OnInit} from "@angular/core";
import {CommonModule} from "@angular/common";
import {MetatagService} from "../../services/metatag.service";
import {Contact} from "../../utils/types/types";
import {ApiService} from "../../services/api.service";
import {TelefonPipe} from "../../utils/pipes/telefon.pipe";

@Component({
  selector: "app-contact",
  standalone: true,
  imports: [CommonModule, TelefonPipe],
  templateUrl: "./contact.component.html",
  styleUrl: "./contact.component.css",
})
export class ContactComponent implements OnInit {
  private meta: MetatagService = inject(MetatagService);
  apiService = inject(ApiService);
  contact = model.required<Contact>();

  ngOnInit(): void {
    this.meta.addTagsForContact(this.contact());
    this.apiService.getContact().subscribe((info) => {
      this.contact.set(info)
    });
  }
}

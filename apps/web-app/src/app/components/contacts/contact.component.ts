import {Component, inject, model, OnInit} from "@angular/core";
import {CommonModule} from "@angular/common";
import {MetatagService} from "../../services/metatag.service";
import {Contact} from "../../../../../../libs/shared/src/lib/types/types";
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
  apiService = inject(ApiService);
  contact = model.required<Contact>();
  private meta: MetatagService = inject(MetatagService);

  ngOnInit(): void {
    this.meta.addTagsForContact(this.contact());
    this.apiService.getContact().subscribe((info) => {
      this.contact.set(info)
    });
  }
}

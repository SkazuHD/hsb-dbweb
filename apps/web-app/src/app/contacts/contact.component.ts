import { Component, OnInit, inject, input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MetatagService } from "../services/metatag.service";
import { Contact } from "../utils/types/types";

@Component({
  selector: "app-contact",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./contact.component.html",
  styleUrl: "./contact.component.css",
})
export class ContactComponent implements OnInit {
  private meta: MetatagService = inject(MetatagService);
  contact = input.required<Contact>();

  ngOnInit(): void {
    this.meta.addTagsForContact(this.contact());
  }
}

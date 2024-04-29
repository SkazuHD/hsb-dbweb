import { Component, OnInit, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetatagService } from '../services/metatag.service';
import { Contact } from '../types/types';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
})
export class ContactComponent implements OnInit {
  private meta: MetatagService = inject(MetatagService);
  contact = input.required<Contact>();

  ngOnInit(): void {
    this.meta.addTagsForContact(this.contact());
    this.meta.addTagsForContact({
      street: 'Beethovenstr. 18a',
      location: '47226 Duisburg-Rheinhausen',
      additionalDescription: 'im Regenbogenhaus',
      titleContact: 'Kontakt',
      titleLocation: 'Trainingshalle',
      titleMap: 'Map',
      content: 'Wir freuen uns auf Fragen und Mitteilungen! Sendet einfach eine E-Mail oder ruft an.',
      email: 'info@atemschulung-griepentrog.de',
      name: 'Peter Griepentrog',
      telephone: 'Tel.: 020 65 - 67 96 31',
      fax: 'Fax: 020 65 - 6 38 41',
      mobil: 'Mobil: 0170 - 90 42 408',
    });
  }
}

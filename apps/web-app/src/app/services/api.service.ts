import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable, of, retry, RetryConfig} from 'rxjs';
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import { Contact, InfoText } from '../utils/types/types';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http: HttpClient = inject(HttpClient);

  testApi() {
    this.http.get('http://127.0.0.1:4201/api').pipe(takeUntilDestroyed()).subscribe((data) => {
      console.debug(data);
    });

    this.events$.pipe(takeUntilDestroyed()).subscribe((event) => {
      console.debug(JSON.parse(event.data));
    });
  }

  private constructSSERequest(url: string) {
    const retryConfig: RetryConfig = {
      delay: 1000,
      resetOnSuccess: true,
    };
    return new Observable<MessageEvent>((observer) => {
      const eventSource = new EventSource(url);
      eventSource.onmessage = (event) => observer.next(event);
      eventSource.onerror = (error) => observer.error(error);
    }).pipe(
      retry(retryConfig),
      map((event: MessageEvent) => {
        return event;
      }),
    );
  }

  get events$(): Observable<MessageEvent> {
    return this.constructSSERequest('http://localhost:4201/events');
  }

  getContact(): Observable<Contact> {
    return of({
        street:'Beethovenstr. 18a',
        location:'47226 Duisburg-Rheinhausen',
        additionalDescription:'im Regenbogenhaus',
        titleContact: 'Kontakt',
        titleLocation: 'Trainingshalle',
        titleMap: 'Karte',
        content:'Wir freuen uns auf Fragen und Mitteilungen! Sendet einfach eine E-Mail oder ruft an.',
        email: 'info@atemschulung-griepentrog.de',
        name: 'Peter Griepentrog',
        telephoneNumbers: 'tel:02065679631',
        telephone: 'Tel.: 020 65 - 67 96 31',
        faxNumbers: 'tel:0206563841',
        fax: 'Fax: 020 65 - 6 38 41',
        mobilNumbers: 'tel:01709042408',
        mobil: 'Mobil: 0170 - 90 42 408',
    })
  }

  getInfo(id: string): Observable<InfoText> {
    return of({
      title: 'Some Example',
      content:
        'remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove ',
      schedule: [
        {
          time: '16:00 - 17:00 Uhr',
          age: '4 - 6 Jahre',
        },
        {
          time: '17:00 - 18:00 Uhr',
          age: '7 - 8 Jahre',
        },
        {
          time: '18:00 - 19:00 Uhr',
          age: '9 - 11 Jahre',
        },
        {
          time: '19:00 - 20:00 Uhr',
          age: '12 - 14 Jahre',
        },
        {
          time: '20:00 - 21:30 Uhr',
          age: '15 - 80 Jahre',
        },
      ],
      schedule_title: 'Trainingszeiten',
      schedule_days: 'Montag und Freitag',
    });
  }


}

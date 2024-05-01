import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable, of, retry, RetryConfig} from 'rxjs';
import {InfoText} from "../utils/types/types";

@Injectable({
  providedIn: 'root',
})
export class ApiServiceService {
  private http: HttpClient = inject(HttpClient);

  constructor() {
    this.http.get('http://127.0.0.1:4201/api').subscribe((data) => {
      console.log(data);
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

  getInfo(id: string): Observable<InfoText> {
    return of({
      title: 'Some Example',
      content: 'remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove ',
      schedule: [
        {

          time: '16:00 - 17:00 Uhr',
          age: '4 - 6 Jahre'
        },
        {
          time: '17:00 - 18:00 Uhr',
          age: '7 - 8 Jahre'
        },
        {
          time: '18:00 - 19:00 Uhr',
          age: '9 - 11 Jahre'
        },
        {
          time: '19:00 - 20:00 Uhr',
          age: '12 - 14 Jahre'
        },
        {
          time: '20:00 - 21:30 Uhr',
          age: '15 - 80 Jahre'
        }],
      schedule_title: 'Trainingszeiten',
      schedule_days: 'Montag und Freitag'
    });
  }
}

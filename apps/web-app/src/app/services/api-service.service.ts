import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable, retry, RetryConfig} from 'rxjs';

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
}

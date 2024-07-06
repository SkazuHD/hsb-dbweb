import {computed, effect, inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, combineLatest, map, Observable, of, retry, RetryConfig, switchMap} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {
  Article,
  Comment,
  CommentCreate,
  Contact,
  Event,
  Image,
  InfoText,
  MessageEventData,
  MessageEventType,
  User
} from '@hsb-dbweb/shared';
import {MatDialog} from '@angular/material/dialog';
import {AddPictureComponent} from '../components/dialog/add-picture/add-picture.component';
import {ConfirmationDialogComponent} from '../components/dialog/confirmation/confirmationDialog.component';


interface apiServiceState {
  events: Event[];
  articles: Article[];
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http: HttpClient = inject(HttpClient);
  private dialog = inject(MatDialog);
  private apiURL = 'http://localhost:4201/api';

  private state = signal<apiServiceState>({
    events: [],
    articles: [],
  });

  // Sources
  private events$ = new BehaviorSubject<Event[]>([]);
  private articles$ = new BehaviorSubject<Article[]>([]);

  // Selectors
  events = computed(() => this.state().events);
  articles = computed(() => this.state().articles);


  get SSEEvents$(): Observable<MessageEvent> {
    return this.constructSSERequest('http://localhost:4201/events');
  }

  constructor() {

    effect(() => console.debug(this.state()))

    this.getAllEvents().pipe(takeUntilDestroyed()).subscribe((events) => {
      this.events$.next(events);
    });

    this.getArticles().pipe(takeUntilDestroyed()).subscribe((articles) => {
      this.articles$.next(articles);
    });

    this.events$.pipe(takeUntilDestroyed()).subscribe((events) => {
      this.state.update((state) => ({
        ...state,
        events
      }))
    })
    this.articles$.pipe(takeUntilDestroyed()).subscribe((articles) => {
      articles.map((article) => {
        this.getLikesByArticleId(article.uid).pipe().subscribe((likes) => {
          this.state.update((state) => ({
            ...state,
            articles: state.articles.filter((a) => a.uid !== article.uid).concat({
              ...article,
              ...likes
            })
          }))
        })
      })
      this.state.update((state) => ({
        ...state,
        articles
      }))

    })
    this.SSEEvents$.pipe(takeUntilDestroyed()).subscribe((event) => {
      const data: MessageEventData = JSON.parse(event.data);
      switch (data.type) {
        case MessageEventType.EVENT:
          this.getEventById(data.uid).pipe().subscribe((event) => {
            this.state.update((state) => ({
              ...state,
              events: [...state.events, event]
            }))
          })
          break
        case MessageEventType.ARTICLE:
          this.getArticleById(data.uid).pipe().subscribe((article) => {
            this.state.update((state: apiServiceState) => ({
              ...state,
              articles: state.articles.filter((a) => a.uid !== data.uid).concat(article)
            }))
          })
          break
        case MessageEventType.COMMENT:
          this.getCommentsByArticleId(data.uid).pipe().subscribe((comments) => {
            this.state.update((state) => ({
              ...state,
              articles: state.articles.map((article) => {
                if (article.uid === data.uid) {
                  return {
                    ...article,
                    comments
                  }
                }
                return article
              })
            }))
          })
          break
      }
    })
  }


  testApi() {
    this.http
      .get(this.apiURL)
      .pipe(takeUntilDestroyed())
      .subscribe((data) => {
        console.debug(data);
      });
  }

  getContact(): Observable<Contact> {
    return of({
      street: 'Beethovenstr. 18a',
      location: '47226 Duisburg-Rheinhausen',
      additionalDescription: 'im Regenbogenhaus',
      titleContact: 'Kontakt',
      titleLocation: 'Trainingshalle',
      titleMap: 'Karte',
      content:
        'Wir freuen uns auf Fragen und Mitteilungen! Sendet einfach eine E-Mail oder ruft an.',
      email: 'info@atemschulung-griepentrog.de',
      name: 'Peter Griepentrog',
      telephone: '02065679631',
      fax: '0206563841',
      mobile: '01709042408'
    });
  }

  requestAddPictureDialog() {
    return this.dialog
      .open(AddPictureComponent, {
        autoFocus: 'input'
      })
      .afterClosed();
  }

  getGallery(): Observable<Image[]> {
    return this.http.get(this.apiURL + '/gallery/').pipe() as Observable<
      Image[]
    >;
  }

  deleteImage(image: string): Observable<NonNullable<unknown>> {
    return this.dialog
      .open(ConfirmationDialogComponent, {
        data: {
          title: 'Bild löschen',
          message: 'Möchten Sie das Bild wirklich löschen?',
          confirmText: 'Löschen',
          cancelText: 'Abbrechen'
        }
      })
      .afterClosed()
      .pipe(
        switchMap((result) => {
          if (result) {
            return this.http.delete(this.apiURL + '/gallery', {
              body: {
                url: image
              }
            });
          } else {
            return of();
          }
        })
      );
  }

  addPicture(image: Image) {
    return this.http.post(this.apiURL + '/gallery', image);
  }

  getInfo(id: string): Observable<InfoText> {
    return of({
      title: 'Some Example',
      content:
        'remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove remove ',
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
        }
      ],
      schedule_title: 'Trainingszeiten',
      schedule_days: 'Montag und Freitag'
    });
  }

  getArticles(): Observable<Article[]> {
    return this.http.get(this.apiURL + '/article').pipe() as Observable<
      Article[]
    >;
  }

  getUserById(id: string): Observable<User> {
    return this.http
      .get(this.apiURL + '/profile/' + id)
      .pipe() as Observable<User>;
  }

  getArticleById(id: string): Observable<Article> {
    return combineLatest([
      this.http.get(this.apiURL + '/article/' + id),
      this.http.get(this.apiURL + '/article/' + id + '/likes')
    ]).pipe(
      map(([article, likes]) => {
        return {
          ...article,
          ...likes
        } as Article;
      })
    );
  }

  getCommentsByArticleId(id: string) {
    return this.http.get<Comment[]>(this.apiURL + '/article/' + id + '/comments').pipe();

  }

  getLikesByArticleId(id: string) {
    return this.http.get(this.apiURL + '/article/' + id + '/likes').pipe();
  }

  updateUser(id: string, user: Partial<User>) {


    return this.http.put(this.apiURL + '/profile/' + id, user);
  }

  createArticle(article: Article) {
    return this.http.post(this.apiURL + '/article/', article);
  }

  updateArticle(article: Partial<Article>) {
    const formData = new FormData();
    formData.append('article', JSON.stringify(article));

    return this.http.put(this.apiURL + '/article/' + article.uid, formData);
  }

  deleteArticle(id: string) {
    return this.http.delete(this.apiURL + '/article/' + id);
  }

  updateArticleLike(id: string) {
    return this.http.post(this.apiURL + '/article/' + id + '/likes', {});
  }

  addArticleComment(id: string, comment: CommentCreate) {
    return this.http.post(this.apiURL + '/article/' + id + '/comments', {
      comment
    });
  }

  deleteComment(articleUid: string, commentUid: string) {
    return this.dialog
      .open(ConfirmationDialogComponent, {
        data: {
          title: 'Kommentar löschen',
          message: 'Möchten Sie den Kommentar wirklich löschen?',
          confirmText: 'Löschen',
          cancelText: 'Abbrechen'
        }
      })
      .afterClosed()
      .pipe(
        switchMap((result) => {
          if (result) {
            return this.http.delete(
              this.apiURL +
              '/article/' +
              articleUid +
              '/comments/' +
              commentUid
            );
          } else {
            return of();
          }
        })
      );
  }

  getAllEvents() {
    return this.http.get<Event[]>(this.apiURL + '/events');
  }

  getEventById(id: string) {
    return this.http.get<Event>(this.apiURL + '/events/' + id);
  }

  getEventsByType(type: string) {
    return this.http.get<Event[]>(this.apiURL + '/events?type=' + type);
  }

  getEventsByDate(date: Date) {
    return this.http.get<Event[]>(this.apiURL + '/events?date=' + date.toISOString());
  }

  getEventsByLocation(location: string) {
    return this.http.get<Event[]>(this.apiURL + '/events?location=' + location);
  }

  getUpcomingEvents(range: number) {
    return this.http.get<Event[]>(this.apiURL + '/events?upcoming=' + range);
  }

  createEvent(event: Event) {
    return this.http.post(this.apiURL + '/events', event);
  }

  updateEvent(event: Partial<Event>) {
    return this.http.put(this.apiURL + '/events/' + event.uid, event);
  }

  deleteEvent(id: string) {
    return this.http.delete(this.apiURL + '/events/' + id);
  }

  getImageById(id: number | string) {
    /* Kinda does not make sense
     Use Id in template instead to get image
     But can be used when converting blob with URL.createObjectURL(blob)
     */
    return this.http.get(this.apiURL + '/images/' + id, {
      responseType: 'blob'
    }).pipe();
  }

  addImage(file: File) {
    const formData = new FormData();
    formData.append('media', file);
    return this.http.post<{ message: string, id: number }>(this.apiURL + '/images', formData).pipe();
  }

  deleteImageById(id: string) {
    return this.http.delete(this.apiURL + '/images/' + id).pipe();
  }

  private constructSSERequest(url: string): Observable<MessageEvent<MessageEventData>> {
    const retryConfig: RetryConfig = {
      delay: 1000,
      resetOnSuccess: true
    };
    return new Observable<MessageEvent<MessageEventData>>((observer) => {
      const eventSource = new EventSource(url);
      eventSource.onmessage = (event) => observer.next(event);
      eventSource.onerror = (error) => observer.error(error);
      eventSource.onopen = () => {
        console.log('SSE connection established');
      };
    }).pipe(
      retry(retryConfig),
      map((event: MessageEvent) => {
        return event;
      })
    );
  }
}

import {Route} from '@angular/router';
import {AppComponent} from './app.component';
import {AppShellComponent} from './app-shell/app-shell';
import {ArticleComponent} from './components/article/article.component';

export const appRoutes: Route[] = [
  {
    path: '',
    component: AppComponent,
    children: [
      {
        path: '',
        component: AppShellComponent,
        children: [
          {
            path: 'markdown',
            loadComponent: () =>
              import("./components/markdown-playground/markdown-playground.component").then(m => m.MarkdownPlaygroundComponent)
          },
          {path: 'articles', component: ArticleComponent},
          {path: 'articles/:slugId', component: ArticleComponent},
          {path: 'profiles/:username', component: AppComponent},
          {path: 'info', component: AppComponent},
          {path: 'info/:id', component: AppComponent},
          {path: 'contact', component: AppComponent},
          {path: 'impressum', component: AppComponent},
          {path: 'datenschutz', component: AppComponent},
          {path: 'sponsor', component: AppComponent},
          {
            path: '404',
            loadComponent: () =>
              import('./components/page-not-found/page-not-found.component').then(m => m.PageNotFoundComponent)
          },
        ],
      },
    ],
  },
  {
    path: '',
    component: AppComponent,
    children: [],
  },
  {
    path: '**',
    redirectTo: '404',
  },
];

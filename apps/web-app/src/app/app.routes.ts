import { Route } from '@angular/router';
import { AppComponent } from './app.component';
import { AppShellComponent } from './app-shell/app-shell';
import { ArticleComponent } from './components/article/article.component';
import { InfoPageComponent } from './components/infopage/info-page.component';
import { LandingPageComponent } from './components/landingPage/landingPage.component';

export const appRoutes: Route[] = [
  {
    path: '',
    component: AppShellComponent,
    children: [
      {
        path: '',
        component: AppShellComponent,
        children: [
          {
            path: 'markdown',
            loadComponent: () =>
              import(
                './components/markdown-playground/markdown-playground.component'
              ).then((m) => m.MarkdownPlaygroundComponent),
          },
          { path: 'articles', component: ArticleComponent },
          { path: 'articles/:slugId', component: ArticleComponent },
          { path: 'profiles/:username', component: AppComponent },
          { path: 'info', component: InfoPageComponent },
          { path: 'info/:id', component: InfoPageComponent },
          { path: 'contact', component: AppComponent },
          { path: 'impressum', component: AppComponent },
          { path: 'datenschutz', component: AppComponent },
          { path: 'sponsor', component: AppComponent },
          { path: 'landingpage', component: LandingPageComponent },
          {
            path: '404',
            loadComponent: () =>
              import(
                './components/page-not-found/page-not-found.component'
              ).then((m) => m.PageNotFoundComponent),
          },
        ],
      },
    ],
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./admin/admin.component').then((m) => m.AdminComponent),
    canActivate: [adminGuard],
    children: [],
  },
  {
    path: '**',
    redirectTo: '404',
  },
];

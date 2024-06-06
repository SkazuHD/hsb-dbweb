import {Route} from '@angular/router';
import {AppComponent} from './app.component';
import {AppShellComponent} from './app-shell/app-shell';
import {ArticleComponent} from './components/article/article.component';
import {ArticlelistComponent} from './components/articlelist/articlelist.component';
import {InfoPageComponent} from './components/infopage/info-page.component';
import {LandingPageComponent} from './components/landingpage/landingPage.component';
import {adminGuard} from './utils/guards/admin.guard';
import {ContactComponent} from './components/contacts/contact.component';

export const appRoutes: Route[] = [
  {
    path: '',
    component: AppShellComponent,
    children: [
      {path: '', component: LandingPageComponent},
      {path: 'articles', component: ArticlelistComponent},
      {path: 'articles/:slugId', component: ArticleComponent},
      {path: 'profiles/:username', component: AppComponent},
      {path: 'info', component: InfoPageComponent},
      {path: 'info/:id', component: InfoPageComponent},
      {path: 'contact', component: ContactComponent},
      {path: 'impressum', component: AppComponent},
      {path: 'datenschutz', component: AppComponent},
      {path: 'sponsor', component: AppComponent},

      {
        path: 'demo',
        loadComponent: () =>
          import('./demo/demo.component').then((m) => m.DemoComponent),
      },
      {
        path: '404',
        loadComponent: () =>
          import('./components/page-not-found/page-not-found.component').then(
            (m) => m.PageNotFoundComponent,
          ),
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

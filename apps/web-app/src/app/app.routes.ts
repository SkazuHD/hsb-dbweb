import {Route} from '@angular/router';
import {AppComponent} from './app.component';
import {AppShellComponent} from './app-shell/app-shell';
import {ArticleComponent} from './components/article/article.component';
import {InfoPageComponent} from "./components/infopage/info-page.component";
import {ContactComponent} from './components/contacts/contact.component';
import {adminGuard} from "./utils/guards/admin.guard";
import {EventpageComponent} from "./components/event-page/eventpage.component";
import { LandingPageComponent } from './components/landingpage/landingPage.component';
import { ArticlelistComponent } from './components/articlelist/articlelist.component';
import {GalleryComponent} from './components/gallery/gallery.component';
import { ProfilePageComponent } from './components/profile-page/profile-page.component';
import { ProfileEditComponent } from './components/profile-edit/profile-edit.component';


export const appRoutes: Route[] = [
  {
    path: '',
    component: AppShellComponent,
    children: [
      {path: '', component: LandingPageComponent},
      {path:'gallery', component: GalleryComponent},
      {path: 'articles', component: ArticlelistComponent},
      {path: 'articles/:slugId', component: ArticleComponent},
      {path: 'profile/:uid', component: ProfilePageComponent},
      {path: 'profile/edit/:uid', component: ProfileEditComponent},
      {path: 'info', component: InfoPageComponent},
      {path: 'info/:id', component: InfoPageComponent},
      {path: 'contact', component: ContactComponent},
      {path: 'events', component: EventpageComponent},
      {path: 'impressum', component: AppComponent},
      {path: 'datenschutz', component: AppComponent},
      {path: 'sponsor', component: AppComponent},
      {path: 'demo', loadComponent: () => import('./demo/demo.component').then(m => m.DemoComponent)},
      {
        path: '404',
        loadComponent: () =>
          import('./components/page-not-found/page-not-found.component').then(m => m.PageNotFoundComponent)
      },
    ],
  },
  {
    path: 'admin',
    loadComponent: () => import('./admin-shell/admin-shell.component').then(m => m.AdminShellComponent),
    canActivate: [adminGuard],
    children: [
      {
        path: '', loadComponent: () => import('./admin/admin.component').then(m => m.AdminComponent),
      }
    ]
  },
  {
    path: '**',
    redirectTo: '404',
  },
];


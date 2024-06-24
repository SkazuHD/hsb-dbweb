import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Article } from '@hsb-dbweb/shared';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NotificationService } from './notification.service';
import { AddArticleComponent } from '../components/dialog/add-article/addArticle.component';
import { EditArticleComponent } from '../components/dialog/edit-article/editArticle.component';
import { AuthService } from './auth.service';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  private dialog = inject(MatDialog);
  private apiService = inject(ApiService);
  private notificationService = inject(NotificationService);
  private auth = inject(AuthService);

  requestAddArticleDialog() {
    return this.dialog
      .open(AddArticleComponent, { width: '1400px', maxWidth: '100%' })
      .afterClosed()
      .pipe(
        tap((result: Article) => {
          if (result) {
            this.createArticle(result).subscribe(() => {
              this.notificationService.success('Article created successfully');
            });
          }
        }),
      );
  }

  requestEditArticleDialog(article: Article) {
    return this.dialog
      .open(EditArticleComponent, {
        data: article,
        width: '1400px',
        maxWidth: '100%',
      })
      .afterClosed()
      .pipe(
        tap((result: Article) => {
          if (result) {
            this.updateArticle(result).subscribe(() => {
              this.notificationService.success('Article updated successfully');
            });
          }
        }),
      );
  }

  getAllArticles() {
    return this.apiService.getArticles();
  }

  createArticle(result: Article) {
    const userId = this.auth.user()?.uid;
    return this.apiService.createArticle({ ...result, userUid: userId });
  }

  getArticleById(id: string) {
    return this.apiService.getArticleById(id);
  }

  updateArticle(article: Partial<Article>) {
    return this.apiService.updateArticle(article);
  }

  deleteArticle(id: string) {
    return this.apiService.deleteArticle(id);
  }
}

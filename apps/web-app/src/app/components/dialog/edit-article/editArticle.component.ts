import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogClose,
  MatDialogContainer,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import {
  MatError,
  MatFormField,
  MatFormFieldModule,
  MatLabel,
} from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { Article } from '@hsb-dbweb/shared';
import { ImageLoad } from '../../../utils/image-load';
import { MatOption, MatSelect } from '@angular/material/select';
import { ArticleComponent } from '../../article/article.component';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';

@Component({
  selector: 'app-edit-article',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButton,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    MatError,
    MatFormField,
    MatIcon,
    MatIconButton,
    MatInput,
    ReactiveFormsModule,
    MatSelect,
    MatOption,
    MatFormFieldModule,
    MatLabel,
    MatDialogContainer,
    ArticleComponent,
    CdkTextareaAutosize,
  ],
  templateUrl: './editArticle.component.html',
  styleUrl: './editArticle.component.css',
})
export class EditArticleComponent {
  article: Article = inject(MAT_DIALOG_DATA);
  date = new Date();
  file = undefined;
  private imageLoad = new ImageLoad();

  editArticleForm: FormGroup = new FormGroup({
    title: new FormControl(this.article.title, [Validators.required]),
    subtitle: new FormControl(this.article.subtitle, [Validators.required]),
    author: new FormControl(this.article.author, [Validators.required]),
    date: new FormControl(this.date, [Validators.required]),
    content: new FormControl(this.article.content, [Validators.required]),
  });

  protected readonly Object = Object;
  private dialog = inject(MatDialogRef);

  constructor() {
    this.editArticleForm.valueChanges.subscribe((value) => {
      this.article = {
        ...this.article,
        ...value,
      };
    });
  }

  onSaveArticle() {
    const updatedArticle: Article = {
      uid: this.article.uid,
      ...this.editArticleForm.value,
      media: this.file,
    };
    this.dialog.close(updatedArticle);
  }

  onFileSelected(event: any) {
    this.file = event.target.files[0];
  }
}

import {Component, computed, inject, Signal, signal, WritableSignal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators,} from '@angular/forms';
import {MatButton, MatIconButton} from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogClose,
  MatDialogContainer,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import {MatError, MatFormField, MatFormFieldModule, MatLabel,} from '@angular/material/form-field';
import {MatIcon} from '@angular/material/icon';
import {MatInput} from '@angular/material/input';
import {Article} from '@hsb-dbweb/shared';
import {MatOption, MatSelect} from '@angular/material/select';
import {ArticleComponent} from '../../article/article.component';
import {CdkTextareaAutosize} from '@angular/cdk/text-field';
import {UploadFileComponent} from "../../upload-file/upload-file.component";

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
    UploadFileComponent,
  ],
  templateUrl: './editArticle.component.html',
  styleUrl: './editArticle.component.css',
})
export class EditArticleComponent {
  data: Article = inject(MAT_DIALOG_DATA);

  date = this.data.date ? new Date(this.data.date) : undefined
  dateTimeLocalValue = this.date ? (new Date(this.date.getTime() - this.date.getTimezoneOffset() * 60000).toISOString()).slice(0, -1) : '';

  article = signal<Article>(this.data)
  imageId: WritableSignal<number | undefined> = signal(this.data.imageUid ?? undefined);
  articleWithImageId: Signal<Article> = computed(() => {
    return {
      ...this.article(),
      imageUid: this.imageId() ?? undefined,
    };

  })

  editArticleForm: FormGroup = new FormGroup({
    title: new FormControl(this.article().title, [Validators.required]),
    subtitle: new FormControl(this.article().subtitle, [Validators.required]),
    author: new FormControl(this.article().author, [Validators.required]),
    date: new FormControl(this.dateTimeLocalValue, [Validators.required]),
    content: new FormControl(this.article().content, [Validators.required]),
  });

  protected readonly Object = Object;
  private dialog = inject(MatDialogRef);


  constructor() {
    this.editArticleForm.valueChanges.subscribe((value) => {
      this.article.update((article) => {
        return {
          ...article,
          ...value,
        };
      })
    });
  }

  onSaveArticle() {

    const date = new Date(this.editArticleForm.get('date')?.value ?? this.date);
    date.setHours(date.getHours() + date.getTimezoneOffset() / 60)

    const updatedArticle: Article = {
      uid: this.article().uid,
      date: date,
      ...this.editArticleForm.value,
    };
    this.dialog.close(updatedArticle);
  }
}

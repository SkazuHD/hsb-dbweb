import {Component, computed, inject, Signal, signal, WritableSignal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators,} from '@angular/forms';
import {MatButton, MatIconButton} from '@angular/material/button';
import {
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
import {ArticleComponent} from '../../article/article.component';
import {MatOption, MatSelect} from '@angular/material/select';
import {Router} from '@angular/router';
import {CdkTextareaAutosize} from "@angular/cdk/text-field";
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
  templateUrl: './addArticle.component.html',
  styleUrl: './addArticle.component.css',
})
export class AddArticleComponent {
  date = new Date().toISOString().split('.')[0].substring(0, new Date().toISOString().split('.')[0].length - 3)

  private router = inject(Router);
  article = signal<Article>({
    title: '',
    content: '',
    uid: '000',
    date: this.date,
    liked: false,
  });
  imageId: WritableSignal<number> = signal(0);


  articleWithImageId: Signal<Article> = computed(() => {
    return {
      ...this.article(),
      imageUid: this.imageId(),
    };

  })

  addArticleForm: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required]),
    subtitle: new FormControl('', []),
    author: new FormControl('', [Validators.required]),
    date: new FormControl(this.date, [Validators.required]),
    content: new FormControl('', [Validators.required]),
  });

  protected readonly Object = Object;
  private dialog = inject(MatDialogRef);

  constructor() {
    this.addArticleForm.valueChanges.subscribe((value) => {
      this.article.update((article) => ({...article, ...value}));
    });
  }

  onSaveArticle() {
    if (this.addArticleForm.invalid) return
    const updatedArticle: Article = {
      ...this.addArticleForm.value,
      imageUid: this.imageId(),
    };
    this.dialog.close(updatedArticle);
  }

}

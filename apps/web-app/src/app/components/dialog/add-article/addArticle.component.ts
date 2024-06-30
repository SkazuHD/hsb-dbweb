import {Component, inject} from '@angular/core';
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
import {ApiService} from '../../../services/api.service';
import {ImageLoad} from '../../../utils/image-load';
import {CdkTextareaAutosize} from "@angular/cdk/text-field";

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
  templateUrl: './addArticle.component.html',
  styleUrl: './addArticle.component.css',
})
export class AddArticleComponent {
  date = new Date();
  private router = inject(Router);
  article = <Article>{
    title: '',
    content: '',
    uid: '000',
    liked: false,
  };
  private imageLoad = new ImageLoad();
  private api: ApiService = inject(ApiService);
  file: File | undefined = undefined;

  editArticleForm: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required]),
    subtitle: new FormControl('', [Validators.required]),
    author: new FormControl('', [Validators.required]),
    date: new FormControl(this.date, [Validators.required]),
    content: new FormControl('', [Validators.required]),
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
      ...this.editArticleForm.value,
      media: this.file,
    };
    this.dialog.close(updatedArticle);
  }

  onFileSelected(event: any) {
    this.file = event.target.files[0];
  }
}

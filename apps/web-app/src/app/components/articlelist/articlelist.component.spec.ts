import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArticlelistComponent } from './articlelist.component';

describe('ArticlelistComponent', () => {
  let component: ArticlelistComponent;
  let fixture: ComponentFixture<ArticlelistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticlelistComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ArticlelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

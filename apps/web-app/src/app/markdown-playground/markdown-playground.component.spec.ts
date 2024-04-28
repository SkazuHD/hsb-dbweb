import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MarkdownPlaygroundComponent } from './markdown-playground.component';

describe('MarkdownPlaygroundComponent', () => {
  let component: MarkdownPlaygroundComponent;
  let fixture: ComponentFixture<MarkdownPlaygroundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarkdownPlaygroundComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MarkdownPlaygroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

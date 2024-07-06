import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserVerwaltungComponent } from './userVerwaltung.component';

describe('UserVerwaltungComponent', () => {
  let component: UserVerwaltungComponent;
  let fixture: ComponentFixture<UserVerwaltungComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserVerwaltungComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserVerwaltungComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

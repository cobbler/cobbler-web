import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileGroupShellComponent } from './profile-group-shell.component';

describe('ProfileGroupShellComponent', () => {
  let component: ProfileGroupShellComponent;
  let fixture: ComponentFixture<ProfileGroupShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileGroupShellComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileGroupShellComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(ProfileGroupShellComponent).toBeTruthy();
  });
});

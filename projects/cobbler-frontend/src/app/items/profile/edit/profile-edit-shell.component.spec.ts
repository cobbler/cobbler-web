import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileShellEditComponent } from './profile-edit-shell.component';

describe('ProfileShellEditComponent', () => {
  let component: ProfileShellEditComponent;
  let fixture: ComponentFixture<ProfileShellEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileShellEditComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileShellEditComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(ProfileShellEditComponent).toBeTruthy();
  });
});

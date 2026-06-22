import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppManageShellComponent } from './app-manage-shell.component';

describe('AppManageShellComponent', () => {
  let component: AppManageShellComponent;
  let fixture: ComponentFixture<AppManageShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppManageShellComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AppManageShellComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(AppManageShellComponent).toBeTruthy();
  });
});

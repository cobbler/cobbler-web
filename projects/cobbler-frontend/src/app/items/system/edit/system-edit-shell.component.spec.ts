import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SystemShellEditComponent } from './system-edit-shell.component';

describe('SystemShellEditComponent', () => {
  let component: SystemShellEditComponent;
  let fixture: ComponentFixture<SystemShellEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SystemShellEditComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SystemShellEditComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(SystemShellEditComponent).toBeTruthy();
  });
});

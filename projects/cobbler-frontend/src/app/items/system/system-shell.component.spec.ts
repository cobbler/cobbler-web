import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SystemShellComponent } from './system-shell.component';

describe('SystemShellComponent', () => {
  let component: SystemShellComponent;
  let fixture: ComponentFixture<SystemShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SystemShellComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SystemShellComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(SystemShellComponent).toBeTruthy();
  });
});

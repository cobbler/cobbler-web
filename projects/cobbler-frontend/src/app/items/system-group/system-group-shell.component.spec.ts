import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SystemGroupShellComponent } from './system-group-shell.component';

describe('SystemGroupShellComponent', () => {
  let component: SystemGroupShellComponent;
  let fixture: ComponentFixture<SystemGroupShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SystemGroupShellComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SystemGroupShellComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(SystemGroupShellComponent).toBeTruthy();
  });
});

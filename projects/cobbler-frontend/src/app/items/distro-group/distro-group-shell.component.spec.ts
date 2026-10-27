import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DistroGroupShellComponent } from './distro-group-shell.component';

describe('DistroGroupShellComponent', () => {
  let component: DistroGroupShellComponent;
  let fixture: ComponentFixture<DistroGroupShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DistroGroupShellComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DistroGroupShellComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(DistroGroupShellComponent).toBeTruthy();
  });
});

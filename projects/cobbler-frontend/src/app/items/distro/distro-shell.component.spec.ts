import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DistroShellComponent } from './distro-shell.component';

describe('DistroShellComponent', () => {
  let component: DistroShellComponent;
  let fixture: ComponentFixture<DistroShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DistroShellComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DistroShellComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(DistroShellComponent).toBeTruthy();
  });
});

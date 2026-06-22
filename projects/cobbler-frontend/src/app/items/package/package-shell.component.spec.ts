import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PackageShellComponent } from './package-shell.component';

describe('PackageShellComponent', () => {
  let component: PackageShellComponent;
  let fixture: ComponentFixture<PackageShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PackageShellComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PackageShellComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(PackageShellComponent).toBeTruthy();
  });
});

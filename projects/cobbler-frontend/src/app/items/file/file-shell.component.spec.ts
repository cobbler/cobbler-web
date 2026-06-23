import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FileShellComponent } from './file-shell.component';

describe('DistroShellComponent', () => {
  let component: FileShellComponent;
  let fixture: ComponentFixture<FileShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileShellComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FileShellComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(FileShellComponent).toBeTruthy();
  });
});

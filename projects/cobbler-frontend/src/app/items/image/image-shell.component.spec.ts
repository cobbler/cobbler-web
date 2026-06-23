import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImageShellComponent } from './image-shell.component';

describe('ImageShellComponent', () => {
  let component: ImageShellComponent;
  let fixture: ComponentFixture<ImageShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageShellComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ImageShellComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(ImageShellComponent).toBeTruthy();
  });
});

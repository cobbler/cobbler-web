import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SnippetShellComponent } from './snippet-shell.component';

describe('SnippetShellComponent', () => {
  let component: SnippetShellComponent;
  let fixture: ComponentFixture<SnippetShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SnippetShellComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SnippetShellComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(SnippetShellComponent).toBeTruthy();
  });
});

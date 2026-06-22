import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TemplateShellComponent } from './template-shell.component';

describe('TemplateShellComponent', () => {
  let component: TemplateShellComponent;
  let fixture: ComponentFixture<TemplateShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemplateShellComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TemplateShellComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(TemplateShellComponent).toBeTruthy();
  });
});

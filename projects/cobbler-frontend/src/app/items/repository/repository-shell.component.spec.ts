import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RepositoryShellComponent } from './repository-shell.component';

describe('RepositoryShellComponent', () => {
  let component: RepositoryShellComponent;
  let fixture: ComponentFixture<RepositoryShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepositoryShellComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RepositoryShellComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(RepositoryShellComponent).toBeTruthy();
  });
});

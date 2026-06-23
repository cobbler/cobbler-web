import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuShellComponent } from './menu-shell.component';

describe('MenuShellComponent', () => {
  let component: MenuShellComponent;
  let fixture: ComponentFixture<MenuShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuShellComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuShellComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(MenuShellComponent).toBeTruthy();
  });
});

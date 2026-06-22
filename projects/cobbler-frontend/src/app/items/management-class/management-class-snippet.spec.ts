import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManagementClassShellComponent } from './managemenet-class-shell';

describe('ManagementClassShellComponent', () => {
  let component: ManagementClassShellComponent;
  let fixture: ComponentFixture<ManagementClassShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagementClassShellComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ManagementClassShellComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(ManagementClassShellComponent).toBeTruthy();
  });
});

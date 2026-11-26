import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { COBBLER_URL, System } from 'cobbler-api';

import { SystemOverviewComponent } from './system-overview.component';

describe('SystemOverviewComponent', () => {
  let component: SystemOverviewComponent;
  let fixture: ComponentFixture<SystemOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SystemOverviewComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: COBBLER_URL,
          useValue: new URL('http://localhost/cobbler_api'),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SystemOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders the system profile in the Profile column, not the system name', () => {
    component.dataSource.data = [
      { name: 'my-system', profile: 'my-profile' } as System,
    ];
    fixture.detectChanges();

    const profileCell = fixture.debugElement.query(
      By.css('td.mat-column-profile'),
    );

    expect(profileCell.nativeElement.textContent).toContain('my-profile');
    expect(profileCell.nativeElement.textContent).not.toContain('my-system');
  });
});

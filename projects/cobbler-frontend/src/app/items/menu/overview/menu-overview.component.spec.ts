import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { COBBLER_URL } from 'cobbler-api';

import { MenuOverviewComponent } from './menu-overview.component';

describe('MenuOverviewComponent', () => {
  let component: MenuOverviewComponent;
  let fixture: ComponentFixture<MenuOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuOverviewComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: COBBLER_URL,
          useValue: new URL('http://localhost/cobbler_api'),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

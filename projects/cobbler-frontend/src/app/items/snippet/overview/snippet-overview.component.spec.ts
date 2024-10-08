import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { COBBLER_URL } from 'cobbler-api';

import { SnippetOverviewComponent } from './snippet-overview.component';

describe('SnippetOverviewComponent', () => {
  let component: SnippetOverviewComponent;
  let fixture: ComponentFixture<SnippetOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SnippetOverviewComponent],
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

    fixture = TestBed.createComponent(SnippetOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

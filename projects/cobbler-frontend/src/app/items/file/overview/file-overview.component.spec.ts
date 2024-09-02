import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { COBBLER_URL } from 'cobbler-api';

import { FileOverviewComponent } from './file-overview.component';

describe('FileOverviewComponent', () => {
  let component: FileOverviewComponent;
  let fixture: ComponentFixture<FileOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileOverviewComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: COBBLER_URL,
          useValue: new URL('http://localhost/cobbler_api'),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FileOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

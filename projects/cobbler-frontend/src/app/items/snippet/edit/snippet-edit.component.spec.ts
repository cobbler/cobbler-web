import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {ActivatedRoute, provideRouter} from '@angular/router';
import {COBBLER_URL} from 'cobbler-api';

import { SnippetEditComponent } from './snippet-edit.component';

describe('SnippetEditComponent', () => {
  let component: SnippetEditComponent;
  let fixture: ComponentFixture<SnippetEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SnippetEditComponent,
        NoopAnimationsModule,
      ],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: COBBLER_URL,
          useValue: new URL('http://localhost/cobbler_api')
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => "testsnippet"
              },
            },
          },
        },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SnippetEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatListModule } from '@angular/material/list';
import {provideRouter} from '@angular/router';

import { RepoSyncComponent } from './repo-sync.component';
import {provideHttpClient} from "@angular/common/http";
import {provideHttpClientTesting} from "@angular/common/http/testing";
import {COBBLER_URL} from "cobbler-api";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";


describe('RepoSyncComponent', () => {
  let component: RepoSyncComponent;
  let fixture: ComponentFixture<RepoSyncComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatListModule,
        RepoSyncComponent,
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
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepoSyncComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

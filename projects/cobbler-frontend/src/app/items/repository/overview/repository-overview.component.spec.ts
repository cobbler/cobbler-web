import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { provideRouter } from '@angular/router';
import { COBBLER_URL } from 'cobbler-api';
import { vi } from 'vitest';

import { RepositoryOverviewComponent } from './repository-overview.component';

describe('RepositoryOverviewComponent', () => {
  let component: RepositoryOverviewComponent;
  let fixture: ComponentFixture<RepositoryOverviewComponent>;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepositoryOverviewComponent],
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

    httpTestingController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(RepositoryOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deletes by uid, not by name (Cobbler 4.0.0 requires an object id for remove_repo)', () => {
    component.deleteRepository('repo-uid-1', 'testrepo');

    const removeRequest = httpTestingController.expectOne((req) =>
      req.body.includes('<methodName>remove_repo</methodName>'),
    );
    // Passing the name ('testrepo') here would silently delete nothing under Cobbler 4.0.0.
    expect(removeRequest.request.body).toContain('repo-uid-1');
    expect(removeRequest.request.body).not.toContain('testrepo');
    removeRequest.flush(
      `<?xml version='1.0'?><methodResponse><params><param><value><boolean>1</boolean></value></param></params></methodResponse>`,
    );
  });

  it('shows the delete-failed snackbar and does not refresh when remove_repo returns false', () => {
    // Drain the initial get_repos() request triggered by ngOnInit() so the later
    // expectNone() only reflects requests caused by deleteRepository() itself.
    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>get_repos</methodName>'),
      )
      .flush(
        `<?xml version='1.0'?><methodResponse><params><param><value><array><data></data></array></value></param></params></methodResponse>`,
      );

    const snackBar = TestBed.inject(MatSnackBar);
    const snackBarSpy = vi.spyOn(snackBar, 'open');

    component.deleteRepository('repo-uid-1', 'testrepo');

    const removeRequest = httpTestingController.expectOne((req) =>
      req.body.includes('<methodName>remove_repo</methodName>'),
    );
    removeRequest.flush(
      `<?xml version='1.0'?><methodResponse><params><param><value><boolean>0</boolean></value></param></params></methodResponse>`,
    );

    expect(snackBarSpy).toHaveBeenCalled();
    httpTestingController.expectNone((req) =>
      req.body.includes('<methodName>get_repos</methodName>'),
    );
  });
});

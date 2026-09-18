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

import { ProfileOverviewComponent } from './profile-overview.component';

describe('ProfileOverviewComponent', () => {
  let component: ProfileOverviewComponent;
  let fixture: ComponentFixture<ProfileOverviewComponent>;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileOverviewComponent],
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
    fixture = TestBed.createComponent(ProfileOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deletes by uid, not by name (Cobbler 4.0.0 requires an object id for remove_profile)', () => {
    component.deleteProfile('profile-uid-1', 'testprofile');

    const removeRequest = httpTestingController.expectOne((req) =>
      req.body.includes('<methodName>remove_profile</methodName>'),
    );
    // Passing the name ('testprofile') here would silently delete nothing under Cobbler 4.0.0.
    expect(removeRequest.request.body).toContain('profile-uid-1');
    expect(removeRequest.request.body).not.toContain('testprofile');
    removeRequest.flush(
      `<?xml version='1.0'?><methodResponse><params><param><value><boolean>1</boolean></value></param></params></methodResponse>`,
    );
  });

  it('shows the delete-failed snackbar and does not refresh when remove_profile returns false', () => {
    // Drain the initial get_profiles() request triggered by ngOnInit() so the later
    // expectNone() only reflects requests caused by deleteProfile() itself.
    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>get_profiles</methodName>'),
      )
      .flush(
        `<?xml version='1.0'?><methodResponse><params><param><value><array><data></data></array></value></param></params></methodResponse>`,
      );

    const snackBar = TestBed.inject(MatSnackBar);
    const snackBarSpy = vi.spyOn(snackBar, 'open');

    component.deleteProfile('profile-uid-1', 'testprofile');

    const removeRequest = httpTestingController.expectOne((req) =>
      req.body.includes('<methodName>remove_profile</methodName>'),
    );
    removeRequest.flush(
      `<?xml version='1.0'?><methodResponse><params><param><value><boolean>0</boolean></value></param></params></methodResponse>`,
    );

    expect(snackBarSpy).toHaveBeenCalled();
    httpTestingController.expectNone((req) =>
      req.body.includes('<methodName>get_profiles</methodName>'),
    );
  });
});

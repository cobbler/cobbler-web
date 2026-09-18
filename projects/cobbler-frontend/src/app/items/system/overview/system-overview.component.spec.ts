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

import { SystemOverviewComponent } from './system-overview.component';

describe('SystemOverviewComponent', () => {
  let component: SystemOverviewComponent;
  let fixture: ComponentFixture<SystemOverviewComponent>;
  let httpTestingController: HttpTestingController;

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

    httpTestingController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(SystemOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('resolves each system.profile/.image uid to the matching item name via get_profiles()/get_images()', () => {
    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>get_systems</methodName>'),
      )
      .flush(
        `<?xml version='1.0'?><methodResponse><params><param><value><array><data></data></array></value></param></params></methodResponse>`,
      );
    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>get_profiles</methodName>'),
      )
      .flush(
        `<?xml version='1.0'?><methodResponse><params><param><value><array><data><value><struct><member><name>uid</name><value><string>profile-uid-1</string></value></member><member><name>name</name><value><string>profile1</string></value></member></struct></value></data></array></value></param></params></methodResponse>`,
      );
    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>get_images</methodName>'),
      )
      .flush(
        `<?xml version='1.0'?><methodResponse><params><param><value><array><data><value><struct><member><name>uid</name><value><string>image-uid-1</string></value></member><member><name>name</name><value><string>image1</string></value></member></struct></value></data></array></value></param></params></methodResponse>`,
      );

    expect(component.profileNameByUid.get('profile-uid-1')).toEqual('profile1');
    expect(component.imageNameByUid.get('image-uid-1')).toEqual('image1');
  });

  it('deletes by uid, not by name (Cobbler 4.0.0 requires an object id for remove_system)', () => {
    component.deleteSystem('system-uid-1', 'testsystem');

    const removeRequest = httpTestingController.expectOne((req) =>
      req.body.includes('<methodName>remove_system</methodName>'),
    );
    // Passing the name ('testsystem') here would silently delete nothing under Cobbler 4.0.0.
    expect(removeRequest.request.body).toContain('system-uid-1');
    expect(removeRequest.request.body).not.toContain('testsystem');
    removeRequest.flush(
      `<?xml version='1.0'?><methodResponse><params><param><value><boolean>1</boolean></value></param></params></methodResponse>`,
    );
  });

  it('shows the delete-failed snackbar and does not refresh when remove_system returns false', () => {
    // Drain the initial get_systems()/get_profiles()/get_images() requests triggered by
    // ngOnInit() so the later expectNone() only reflects requests caused by deleteSystem() itself.
    const emptyArrayResponse = `<?xml version='1.0'?><methodResponse><params><param><value><array><data></data></array></value></param></params></methodResponse>`;
    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>get_systems</methodName>'),
      )
      .flush(emptyArrayResponse);
    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>get_profiles</methodName>'),
      )
      .flush(emptyArrayResponse);
    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>get_images</methodName>'),
      )
      .flush(emptyArrayResponse);

    const snackBar = TestBed.inject(MatSnackBar);
    const snackBarSpy = vi.spyOn(snackBar, 'open');

    component.deleteSystem('system-uid-1', 'testsystem');

    const removeRequest = httpTestingController.expectOne((req) =>
      req.body.includes('<methodName>remove_system</methodName>'),
    );
    removeRequest.flush(
      `<?xml version='1.0'?><methodResponse><params><param><value><boolean>0</boolean></value></param></params></methodResponse>`,
    );

    expect(snackBarSpy).toHaveBeenCalled();
    httpTestingController.expectNone((req) =>
      req.body.includes('<methodName>get_systems</methodName>'),
    );
  });
});

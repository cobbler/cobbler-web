import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { COBBLER_URL } from 'cobbler-api';
import { vi } from 'vitest';

import { DistrosOverviewComponent } from './distros-overview.component';

describe('DistroOverviewComponent', () => {
  let component: DistrosOverviewComponent;
  let fixture: ComponentFixture<DistrosOverviewComponent>;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatTabsModule,
        MatTableModule,
        NoopAnimationsModule,
        DistrosOverviewComponent,
      ],
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
  });

  beforeEach(() => {
    httpTestingController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(DistrosOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deletes by uid, not by name (Cobbler 4.0.0 requires an object id for remove_distro)', () => {
    component.deleteDistro('distro-uid-1', 'testdistro');

    const removeRequest = httpTestingController.expectOne((req) =>
      req.body.includes('<methodName>remove_distro</methodName>'),
    );
    // Passing the name ('testdistro') here would silently delete nothing under Cobbler 4.0.0.
    expect(removeRequest.request.body).toContain('distro-uid-1');
    expect(removeRequest.request.body).not.toContain('testdistro');
    removeRequest.flush(
      `<?xml version='1.0'?><methodResponse><params><param><value><boolean>1</boolean></value></param></params></methodResponse>`,
    );
  });

  it('shows the delete-failed snackbar and does not refresh when remove_distro returns false', () => {
    // Drain the initial get_distros() request triggered by ngOnInit() so the later
    // expectNone() only reflects requests caused by deleteDistro() itself.
    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>get_distros</methodName>'),
      )
      .flush(
        `<?xml version='1.0'?><methodResponse><params><param><value><array><data></data></array></value></param></params></methodResponse>`,
      );

    const snackBar = TestBed.inject(MatSnackBar);
    const snackBarSpy = vi.spyOn(snackBar, 'open');

    component.deleteDistro('distro-uid-1', 'testdistro');

    const removeRequest = httpTestingController.expectOne((req) =>
      req.body.includes('<methodName>remove_distro</methodName>'),
    );
    removeRequest.flush(
      `<?xml version='1.0'?><methodResponse><params><param><value><boolean>0</boolean></value></param></params></methodResponse>`,
    );

    expect(snackBarSpy).toHaveBeenCalled();
    httpTestingController.expectNone((req) =>
      req.body.includes('<methodName>get_distros</methodName>'),
    );
  });
});

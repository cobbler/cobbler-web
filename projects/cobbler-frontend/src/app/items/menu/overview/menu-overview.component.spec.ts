import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { COBBLER_URL } from 'cobbler-api';
import { vi } from 'vitest';

import { MenuOverviewComponent } from './menu-overview.component';

describe('MenuOverviewComponent', () => {
  let component: MenuOverviewComponent;
  let fixture: ComponentFixture<MenuOverviewComponent>;
  let httpTestingController: HttpTestingController;

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

    httpTestingController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(MenuOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deletes by uid, not by name (Cobbler 4.0.0 requires an object id for remove_menu)', () => {
    component.deleteMenu('menu-uid-1', 'testmenu');

    const removeRequest = httpTestingController.expectOne((req) =>
      req.body.includes('<methodName>remove_menu</methodName>'),
    );
    // Passing the name ('testmenu') here would silently delete nothing under Cobbler 4.0.0.
    expect(removeRequest.request.body).toContain('menu-uid-1');
    expect(removeRequest.request.body).not.toContain('testmenu');
    removeRequest.flush(
      `<?xml version='1.0'?><methodResponse><params><param><value><boolean>1</boolean></value></param></params></methodResponse>`,
    );
  });

  it('shows the delete-failed snackbar and does not refresh when remove_menu returns false', () => {
    // Drain the initial get_menus() request triggered by ngOnInit() so the later
    // expectNone() only reflects requests caused by deleteMenu() itself.
    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>get_menus</methodName>'),
      )
      .flush(
        `<?xml version='1.0'?><methodResponse><params><param><value><array><data></data></array></value></param></params></methodResponse>`,
      );

    const snackBar = TestBed.inject(MatSnackBar);
    const snackBarSpy = vi.spyOn(snackBar, 'open');

    component.deleteMenu('menu-uid-1', 'testmenu');

    const removeRequest = httpTestingController.expectOne((req) =>
      req.body.includes('<methodName>remove_menu</methodName>'),
    );
    removeRequest.flush(
      `<?xml version='1.0'?><methodResponse><params><param><value><boolean>0</boolean></value></param></params></methodResponse>`,
    );

    expect(snackBarSpy).toHaveBeenCalled();
    httpTestingController.expectNone((req) =>
      req.body.includes('<methodName>get_menus</methodName>'),
    );
  });
});

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter, withRouterConfig } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { COBBLER_URL, CobblerApiService } from 'cobbler-api';
import { routes } from '../../app-routing.module';

import { ViewAutoinstallComponent } from './view-autoinstall.component';

describe('ViewAutoinstallComponent', () => {
  // Uses the real, exported route config so the nested profile/system
  // autoinstall routes (and their data) are what is under test.
  async function navigate(
    url: string,
    generate: ReturnType<typeof vi.fn>,
    snackBarOpen?: ReturnType<typeof vi.fn>,
  ): Promise<ViewAutoinstallComponent> {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule],
      providers: [
        provideRouter(
          routes,
          withRouterConfig({ paramsInheritanceStrategy: 'always' }),
        ),
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: COBBLER_URL,
          useValue: new URL('http://localhost/cobbler_api'),
        },
        ...(snackBarOpen
          ? [{ provide: MatSnackBar, useValue: { open: snackBarOpen } }]
          : []),
        {
          provide: CobblerApiService,
          useValue: {
            token_check: () => of(true),
            generate_autoinstall: generate,
          },
        },
      ],
    }).compileComponents();
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl(url);
    // The routed component sits below the shell components
    return harness.fixture.debugElement.query(
      By.directive(ViewAutoinstallComponent),
    ).componentInstance;
  }

  it('requests the profile preview with explicit type and field', async () => {
    const spy = vi.fn().mockReturnValue(of('#profile kickstart'));
    const component = await navigate('/items/profile/foo/autoinstall', spy);
    expect(spy).toHaveBeenCalledWith('foo', 'profile', 'name', '', '');
    expect(component.autoinstallFormControl.value).toBe('#profile kickstart');
  });

  it('requests the system preview with explicit type and field', async () => {
    const spy = vi.fn().mockReturnValue(of('#system kickstart'));
    const component = await navigate('/items/system/bar/autoinstall', spy);
    expect(spy).toHaveBeenCalledWith('bar', 'system', 'name', '', '');
    expect(component.autoinstallFormControl.value).toBe('#system kickstart');
  });

  it('shows an error snackbar when generating fails', async () => {
    const spy = vi
      .fn()
      .mockReturnValue(throwError(() => new Error('boom failed')));
    const open = vi.fn();
    await navigate('/items/profile/foo/autoinstall', spy, open);
    expect(open).toHaveBeenCalledTimes(1);
    expect(open.mock.calls[0][0]).toBe('boom failed');
  });
});

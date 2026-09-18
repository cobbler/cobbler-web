import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CobblerApiService, COBBLER_URL } from 'cobbler-api';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { BuildISOComponent } from './build-iso.component';

describe('BuildISOComponent', () => {
  let component: BuildISOComponent;
  let fixture: ComponentFixture<BuildISOComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuildISOComponent, NoopAnimationsModule],
      providers: [
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
    fixture = TestBed.createComponent(BuildISOComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not run without a distro', () => {
    const api = TestBed.inject(CobblerApiService);
    const buildiso = vi.spyOn(api, 'background_buildiso');

    component.runBuildiso();

    expect(
      component.buildisoFormGroup.controls.distro.hasError('required'),
    ).toBe(true);
    expect(buildiso).not.toHaveBeenCalled();
  });

  it('should send the Cobbler 4 option names', () => {
    const api = TestBed.inject(CobblerApiService);
    const buildiso = vi
      .spyOn(api, 'background_buildiso')
      .mockReturnValue(of('task-id'));
    component.buildisoFormGroup.patchValue({
      distro: 'distro-uid',
      exclude_dns: true,
      exclude_systems: true,
      xorrisofs_opts: '-v',
      esp: '/esp.img',
    });

    component.runBuildiso();

    expect(buildiso).toHaveBeenCalledTimes(1);
    expect(buildiso.mock.calls[0][0]).toEqual({
      iso: '',
      profiles: [],
      systems: [],
      buildisodir: '',
      distro: 'distro-uid',
      standalone: true,
      airgapped: false,
      source: '',
      exclude_dns: true,
      exclude_systems: true,
      xorrisofs_opts: '-v',
      esp: '/esp.img',
    });
  });
});

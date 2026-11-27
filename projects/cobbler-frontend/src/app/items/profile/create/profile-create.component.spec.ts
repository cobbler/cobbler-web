import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CobblerApiService, COBBLER_URL } from 'cobbler-api';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { ProfileCreateComponent } from './profile-create.component';

describe('ProfileCreateComponent', () => {
  let component: ProfileCreateComponent;
  let fixture: ComponentFixture<ProfileCreateComponent>;
  let api: {
    get_distros: ReturnType<typeof vi.fn>;
    new_profile: ReturnType<typeof vi.fn>;
    modify_profile: ReturnType<typeof vi.fn>;
    save_profile: ReturnType<typeof vi.fn>;
  };
  let dialogRef: { close: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    api = {
      get_distros: vi.fn().mockReturnValue(
        of([
          { uid: 'uid-1', name: 'first' },
          { uid: 'uid-2', name: 'second' },
        ]),
      ),
      new_profile: vi.fn().mockReturnValue(of('handle')),
      modify_profile: vi.fn().mockReturnValue(of(true)),
      save_profile: vi.fn().mockReturnValue(of(true)),
    };
    dialogRef = { close: vi.fn() };
    await TestBed.configureTestingModule({
      imports: [
        ProfileCreateComponent,
        MatButtonModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatInputModule,
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: COBBLER_URL,
          useValue: new URL('http://localhost/cobbler_api'),
        },
        { provide: CobblerApiService, useValue: api },
        { provide: MatDialogRef, useValue: dialogRef },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loads the distro options from the API as uid/name pairs', () => {
    expect(api.get_distros).toHaveBeenCalled();
    expect(component.distroOptions).toEqual([
      { value: 'uid-1', label: 'first' },
      { value: 'uid-2', label: 'second' },
    ]);
  });

  it('requires a distro selection', () => {
    component.profileCreateFormGroup.patchValue({ name: 'x' });
    expect(component.profileCreateFormGroup.invalid).toBe(true);
    component.profileCreateFormGroup.patchValue({ distro: 'uid-2' });
    expect(component.profileCreateFormGroup.valid).toBe(true);
  });

  it('sends the selected uid, not the name, to modify_profile', () => {
    component.profileCreateFormGroup.patchValue({
      name: 'new-profile',
      distro: 'uid-2',
    });
    component.createProfile();
    expect(api.modify_profile).toHaveBeenCalledWith(
      'handle',
      ['distro'],
      'uid-2',
      expect.anything(),
    );
    expect(api.save_profile).toHaveBeenCalledWith(
      'handle',
      true,
      true,
      'new',
      expect.anything(),
    );
    expect(dialogRef.close).toHaveBeenCalledWith('new-profile');
  });
});

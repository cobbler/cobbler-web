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

import { SystemCreateComponent } from './system-create.component';

describe('SystemCreateComponent', () => {
  let component: SystemCreateComponent;
  let fixture: ComponentFixture<SystemCreateComponent>;
  let api: {
    get_profiles: ReturnType<typeof vi.fn>;
    new_system: ReturnType<typeof vi.fn>;
    modify_system: ReturnType<typeof vi.fn>;
    save_system: ReturnType<typeof vi.fn>;
  };
  let dialogRef: { close: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    api = {
      get_profiles: vi.fn().mockReturnValue(
        of([
          { uid: 'uid-1', name: 'first' },
          { uid: 'uid-2', name: 'second' },
        ]),
      ),
      new_system: vi.fn().mockReturnValue(of('handle')),
      modify_system: vi.fn().mockReturnValue(of(true)),
      save_system: vi.fn().mockReturnValue(of(true)),
    };
    dialogRef = { close: vi.fn() };
    await TestBed.configureTestingModule({
      imports: [
        SystemCreateComponent,
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

    fixture = TestBed.createComponent(SystemCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loads the profile options from the API as uid/name pairs', () => {
    expect(api.get_profiles).toHaveBeenCalled();
    expect(component.profileOptions).toEqual([
      { value: 'uid-1', label: 'first' },
      { value: 'uid-2', label: 'second' },
    ]);
  });

  it('requires a profile selection', () => {
    component.systemCreateFormGroup.patchValue({ name: 'x' });
    expect(component.systemCreateFormGroup.invalid).toBe(true);
    component.systemCreateFormGroup.patchValue({ profile: 'uid-2' });
    expect(component.systemCreateFormGroup.valid).toBe(true);
  });

  it('sends the selected uid, not the name, to modify_system', () => {
    component.systemCreateFormGroup.patchValue({
      name: 'new-system',
      profile: 'uid-2',
    });
    component.createSystem();
    expect(api.modify_system).toHaveBeenCalledWith(
      'handle',
      ['profile'],
      'uid-2',
      expect.anything(),
    );
    expect(api.save_system).toHaveBeenCalledWith(
      'handle',
      true,
      true,
      'new',
      expect.anything(),
    );
    expect(dialogRef.close).toHaveBeenCalledWith('new-system');
  });
});

import { Injectable } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import {
  COBBLER_URL,
  CobblerApiService,
  Profile,
  ProfileGroup,
} from 'cobbler-api';
import { Observable, of } from 'rxjs';
import { vi } from 'vitest';

import { CobblerInputChoices } from '../../../utils';
import { ProfileGroupEditComponent } from './profile-group-edit.component';

const modifyCalls: Array<{ attribute: string[]; arg: any }> = [];
let saveCalled = false;
let getProfileGroupCalls = 0;
let getProfilesCalls = 0;
let removeReturnValue = true;
let copyNewName = 'testprofilegroup-copy';

@Injectable()
class MockCobblerApiService extends CobblerApiService {
  reconfigureService(url: URL) {}

  get_profile_group(
    objectId: string,
    flatten?: boolean,
    resolved?: boolean,
    token?: string,
  ): Observable<ProfileGroup> {
    getProfileGroupCalls++;
    expect(objectId).toBe('profile-group-handle-1');
    return new Observable((subscriber) => {
      subscriber.next({
        uid: 'profile-group-uid-1',
        name: 'testprofilegroup',
        comment: 'a comment',
        ctime: 0,
        mtime: 0,
        depth: 0,
        is_subobject: false,
        parent: '',
        members: ['profile-uid-1'],
      } as unknown as ProfileGroup);
      subscriber.complete();
    });
  }

  get_profiles(): Observable<Array<Profile>> {
    getProfilesCalls++;
    return of([
      { uid: 'profile-uid-1', name: 'profile1' },
      { uid: 'profile-uid-2', name: 'profile2' },
    ] as unknown as Array<Profile>);
  }

  get_profile_group_handle(name: string): Observable<string> {
    expect(name).toBe('testprofilegroup');
    return new Observable((subscriber) => {
      subscriber.next('profile-group-handle-1');
      subscriber.complete();
    });
  }

  modify_profile_group(
    objectId: string,
    attribute: Array<string>,
    arg: any,
    token: string,
  ): Observable<boolean> {
    expect(objectId).toBe('profile-group-handle-1');
    modifyCalls.push({ attribute, arg });
    return new Observable((subscriber) => {
      subscriber.next(true);
      subscriber.complete();
    });
  }

  save_profile_group(
    objectId: string,
    withTriggers: boolean,
    withSync: boolean,
    editMode: string,
    token: string,
  ): Observable<boolean> {
    expect(objectId).toBe('profile-group-handle-1');
    expect(withTriggers).toBe(false);
    expect(withSync).toBe(false);
    expect(editMode).toBe('');
    saveCalled = true;
    return new Observable((subscriber) => {
      subscriber.next(true);
      subscriber.complete();
    });
  }

  remove_profile_group(
    objectId: string,
    token: string,
    recursive?: boolean,
  ): Observable<boolean> {
    // Cobbler 4.0.0 requires the object's uid, not its name.
    expect(objectId).toBe('profile-group-uid-1');
    return of(removeReturnValue);
  }

  copy_profile_group(
    objectId: string,
    newName: string,
    token: string,
  ): Observable<boolean> {
    expect(objectId).toBe('profile-group-handle-1');
    expect(newName).toBe(copyNewName);
    return of(true);
  }
}

describe('ProfileGroupEditComponent', () => {
  let component: ProfileGroupEditComponent;
  let fixture: ComponentFixture<ProfileGroupEditComponent>;

  beforeEach(async () => {
    modifyCalls.length = 0;
    saveCalled = false;
    getProfileGroupCalls = 0;
    getProfilesCalls = 0;
    removeReturnValue = true;
    copyNewName = 'testprofilegroup-copy';

    await TestBed.configureTestingModule({
      imports: [ProfileGroupEditComponent, NoopAnimationsModule],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: COBBLER_URL,
          useValue: new URL('http://localhost/cobbler_api'),
        },
        {
          provide: CobblerApiService,
          useClass: MockCobblerApiService,
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => 'testprofilegroup',
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileGroupEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loads the profile group via get_profile_group on init', () => {
    expect(getProfileGroupCalls).toBe(1);
    expect(component.profileGroup.name).toBe('testprofilegroup');
    expect(component.profileGroupFormGroup.get('members')?.value).toEqual([
      'profile-uid-1',
    ]);
  });

  it('populates the members options with uid/name pairs from get_profiles', () => {
    expect(getProfilesCalls).toBe(1);
    const membersInput = component.profileGroupEditableInputData.find(
      (input) => input.formControlName === 'members',
    );
    expect(membersInput?.inputType).toBe(
      CobblerInputChoices.MULTI_SELECT_STRICT_DROPDOWN,
    );
    expect(membersInput?.options).toEqual([
      { value: 'profile-uid-1', label: 'profile1' },
      { value: 'profile-uid-2', label: 'profile2' },
    ]);
  });

  it('displays the member profile names instead of their uids, as linked chips', async () => {
    component.editProfileGroup();
    fixture.detectChanges();
    await fixture.whenStable();

    const chip: HTMLElement =
      fixture.nativeElement.querySelector('mat-chip-row');
    expect(chip.textContent).toContain('profile1');
    expect(chip.textContent).not.toContain('profile-uid-1');

    const link: HTMLAnchorElement =
      fixture.nativeElement.querySelector('mat-chip-row a');
    expect(link).not.toBeNull();
    expect(link.getAttribute('href')).toEqual('/items/profile/profile1');
  });

  it('saves the members as uids', () => {
    component.editProfileGroup();
    const membersControl = component.profileGroupFormGroup.get(
      'members',
    ) as unknown as FormControl;
    membersControl.setValue(['profile-uid-1', 'profile-uid-2']);
    membersControl.markAsDirty();

    component.saveProfileGroup();

    expect(modifyCalls).toEqual([
      { attribute: ['members'], arg: ['profile-uid-1', 'profile-uid-2'] },
    ]);
    expect(saveCalled).toBe(true);
  });

  it('saves a dirty field via modify_profile_group then save_profile_group', () => {
    component.editProfileGroup();
    const commentControl = component.profileGroupFormGroup.get(
      'comment',
    ) as unknown as FormControl;
    commentControl.setValue('updated comment');
    commentControl.markAsDirty();

    component.saveProfileGroup();

    expect(modifyCalls).toEqual([
      { attribute: ['comment'], arg: 'updated comment' },
    ]);
    expect(saveCalled).toBe(true);
  });

  it('saves with nothing dirty by calling save_profile_group directly and exits edit mode', () => {
    // combineLatest([]) never emits, so saveProfileGroup() must short-circuit around it instead of
    // hanging with modifyObservables empty (no dirty fields).
    component.editProfileGroup();

    component.saveProfileGroup();

    expect(modifyCalls).toEqual([]);
    expect(saveCalled).toBe(true);
    expect(component.isEditMode).toBe(false);
  });

  it('removeProfileGroup navigates to the overview and shows no error on success', () => {
    const router = TestBed.inject(Router);
    const snackBar = TestBed.inject(MatSnackBar);
    const navigateSpy = vi.spyOn(router, 'navigate');
    const snackBarSpy = vi.spyOn(snackBar, 'open');

    component.removeProfileGroup();

    expect(navigateSpy).toHaveBeenCalledWith(['/items', 'profile-group']);
    expect(snackBarSpy).not.toHaveBeenCalled();
  });

  it('removeProfileGroup shows an error and does not navigate on failure', () => {
    removeReturnValue = false;
    const router = TestBed.inject(Router);
    const snackBar = TestBed.inject(MatSnackBar);
    const navigateSpy = vi.spyOn(router, 'navigate');
    const snackBarSpy = vi.spyOn(snackBar, 'open');

    component.removeProfileGroup();

    expect(navigateSpy).not.toHaveBeenCalled();
    expect(snackBarSpy).toHaveBeenCalled();
  });

  it('copyProfileGroup navigates to the new item under /items/profile-group', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate');
    vi.spyOn(component.dialog, 'open').mockReturnValue({
      afterClosed: () => of(copyNewName),
    } as any);

    component.copyProfileGroup('profile-group-uid-1', 'testprofilegroup');

    expect(navigateSpy).toHaveBeenCalledWith([
      '/items',
      'profile-group',
      copyNewName,
    ]);
  });
});

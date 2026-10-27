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
  Distro,
  DistroGroup,
} from 'cobbler-api';
import { Observable, of } from 'rxjs';
import { vi } from 'vitest';

import { CobblerInputChoices } from '../../../utils';
import { DistroGroupEditComponent } from './distro-group-edit.component';

const modifyCalls: Array<{ attribute: string[]; arg: any }> = [];
let saveCalled = false;
let getDistroGroupCalls = 0;
let getDistrosCalls = 0;
let removeReturnValue = true;
let copyNewName = 'testdistrogroup-copy';

@Injectable()
class MockCobblerApiService extends CobblerApiService {
  reconfigureService(url: URL) {}

  get_distro_group(
    objectId: string,
    flatten?: boolean,
    resolved?: boolean,
    token?: string,
  ): Observable<DistroGroup> {
    getDistroGroupCalls++;
    expect(objectId).toBe('distro-group-handle-1');
    return new Observable((subscriber) => {
      subscriber.next({
        uid: 'distro-group-uid-1',
        name: 'testdistrogroup',
        comment: 'a comment',
        ctime: 0,
        mtime: 0,
        depth: 0,
        is_subobject: false,
        parent: '',
        members: ['distro-uid-1'],
      } as unknown as DistroGroup);
      subscriber.complete();
    });
  }

  get_distros(): Observable<Array<Distro>> {
    getDistrosCalls++;
    return of([
      { uid: 'distro-uid-1', name: 'distro1' },
      { uid: 'distro-uid-2', name: 'distro2' },
    ] as unknown as Array<Distro>);
  }

  get_distro_group_handle(name: string): Observable<string> {
    expect(name).toBe('testdistrogroup');
    return new Observable((subscriber) => {
      subscriber.next('distro-group-handle-1');
      subscriber.complete();
    });
  }

  modify_distro_group(
    objectId: string,
    attribute: Array<string>,
    arg: any,
    token: string,
  ): Observable<boolean> {
    expect(objectId).toBe('distro-group-handle-1');
    modifyCalls.push({ attribute, arg });
    return new Observable((subscriber) => {
      subscriber.next(true);
      subscriber.complete();
    });
  }

  save_distro_group(
    objectId: string,
    withTriggers: boolean,
    withSync: boolean,
    editMode: string,
    token: string,
  ): Observable<boolean> {
    expect(objectId).toBe('distro-group-handle-1');
    expect(withTriggers).toBe(false);
    expect(withSync).toBe(false);
    expect(editMode).toBe('');
    saveCalled = true;
    return new Observable((subscriber) => {
      subscriber.next(true);
      subscriber.complete();
    });
  }

  remove_distro_group(
    objectId: string,
    token: string,
    recursive?: boolean,
  ): Observable<boolean> {
    // Cobbler 4.0.0 requires the object's uid, not its name.
    expect(objectId).toBe('distro-group-uid-1');
    return of(removeReturnValue);
  }

  copy_distro_group(
    objectId: string,
    newName: string,
    token: string,
  ): Observable<boolean> {
    expect(objectId).toBe('distro-group-handle-1');
    expect(newName).toBe(copyNewName);
    return of(true);
  }
}

describe('DistroGroupEditComponent', () => {
  let component: DistroGroupEditComponent;
  let fixture: ComponentFixture<DistroGroupEditComponent>;

  beforeEach(async () => {
    modifyCalls.length = 0;
    saveCalled = false;
    getDistroGroupCalls = 0;
    getDistrosCalls = 0;
    removeReturnValue = true;
    copyNewName = 'testdistrogroup-copy';

    await TestBed.configureTestingModule({
      imports: [DistroGroupEditComponent, NoopAnimationsModule],
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
                get: () => 'testdistrogroup',
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DistroGroupEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loads the distro group via get_distro_group on init', () => {
    expect(getDistroGroupCalls).toBe(1);
    expect(component.distroGroup.name).toBe('testdistrogroup');
    expect(component.distroGroupFormGroup.get('members')?.value).toEqual([
      'distro-uid-1',
    ]);
  });

  it('populates the members options with uid/name pairs from get_distros', () => {
    expect(getDistrosCalls).toBe(1);
    const membersInput = component.distroGroupEditableInputData.find(
      (input) => input.formControlName === 'members',
    );
    expect(membersInput?.inputType).toBe(
      CobblerInputChoices.MULTI_SELECT_STRICT_DROPDOWN,
    );
    expect(membersInput?.options).toEqual([
      { value: 'distro-uid-1', label: 'distro1' },
      { value: 'distro-uid-2', label: 'distro2' },
    ]);
  });

  it('displays the member distro names instead of their uids, as linked chips', async () => {
    component.editDistroGroup();
    fixture.detectChanges();
    await fixture.whenStable();

    const chip: HTMLElement =
      fixture.nativeElement.querySelector('mat-chip-row');
    expect(chip.textContent).toContain('distro1');
    expect(chip.textContent).not.toContain('distro-uid-1');

    const link: HTMLAnchorElement =
      fixture.nativeElement.querySelector('mat-chip-row a');
    expect(link).not.toBeNull();
    expect(link.getAttribute('href')).toEqual('/items/distro/distro1');
  });

  it('saves the members as uids', () => {
    component.editDistroGroup();
    const membersControl = component.distroGroupFormGroup.get(
      'members',
    ) as unknown as FormControl;
    membersControl.setValue(['distro-uid-1', 'distro-uid-2']);
    membersControl.markAsDirty();

    component.saveDistroGroup();

    expect(modifyCalls).toEqual([
      { attribute: ['members'], arg: ['distro-uid-1', 'distro-uid-2'] },
    ]);
    expect(saveCalled).toBe(true);
  });

  it('saves a dirty field via modify_distro_group then save_distro_group', () => {
    component.editDistroGroup();
    const commentControl = component.distroGroupFormGroup.get(
      'comment',
    ) as unknown as FormControl;
    commentControl.setValue('updated comment');
    commentControl.markAsDirty();

    component.saveDistroGroup();

    expect(modifyCalls).toEqual([
      { attribute: ['comment'], arg: 'updated comment' },
    ]);
    expect(saveCalled).toBe(true);
  });

  it('saves with nothing dirty by calling save_distro_group directly and exits edit mode', () => {
    // combineLatest([]) never emits, so saveDistroGroup() must short-circuit around it instead of
    // hanging with modifyObservables empty (no dirty fields).
    component.editDistroGroup();

    component.saveDistroGroup();

    expect(modifyCalls).toEqual([]);
    expect(saveCalled).toBe(true);
    expect(component.isEditMode).toBe(false);
  });

  it('removeDistroGroup navigates to the overview and shows no error on success', () => {
    const router = TestBed.inject(Router);
    const snackBar = TestBed.inject(MatSnackBar);
    const navigateSpy = vi.spyOn(router, 'navigate');
    const snackBarSpy = vi.spyOn(snackBar, 'open');

    component.removeDistroGroup();

    expect(navigateSpy).toHaveBeenCalledWith(['/items', 'distro-group']);
    expect(snackBarSpy).not.toHaveBeenCalled();
  });

  it('removeDistroGroup shows an error and does not navigate on failure', () => {
    removeReturnValue = false;
    const router = TestBed.inject(Router);
    const snackBar = TestBed.inject(MatSnackBar);
    const navigateSpy = vi.spyOn(router, 'navigate');
    const snackBarSpy = vi.spyOn(snackBar, 'open');

    component.removeDistroGroup();

    expect(navigateSpy).not.toHaveBeenCalled();
    expect(snackBarSpy).toHaveBeenCalled();
  });

  it('copyDistroGroup navigates to the new item under /items/distro-group', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate');
    vi.spyOn(component.dialog, 'open').mockReturnValue({
      afterClosed: () => of(copyNewName),
    } as any);

    component.copyDistroGroup('distro-group-uid-1', 'testdistrogroup');

    expect(navigateSpy).toHaveBeenCalledWith([
      '/items',
      'distro-group',
      copyNewName,
    ]);
  });
});

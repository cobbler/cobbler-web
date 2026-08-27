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
  System,
  SystemGroup,
} from 'cobbler-api';
import { Observable, of } from 'rxjs';
import { vi } from 'vitest';

import { CobblerInputChoices } from '../../../utils';
import { SystemGroupEditComponent } from './system-group-edit.component';

const modifyCalls: Array<{ attribute: string[]; arg: any }> = [];
let saveCalled = false;
let getSystemGroupCalls = 0;
let getSystemsCalls = 0;
let removeReturnValue = true;
let copyNewName = 'testsystemgroup-copy';

@Injectable()
class MockCobblerApiService extends CobblerApiService {
  reconfigureService(url: URL) {}

  get_system_group(
    objectId: string,
    flatten?: boolean,
    resolved?: boolean,
    token?: string,
  ): Observable<SystemGroup> {
    getSystemGroupCalls++;
    expect(objectId).toBe('system-group-handle-1');
    return new Observable((subscriber) => {
      subscriber.next({
        uid: 'system-group-uid-1',
        name: 'testsystemgroup',
        comment: 'a comment',
        ctime: 0,
        mtime: 0,
        depth: 0,
        is_subobject: false,
        parent: '',
        members: ['system-uid-1'],
      } as unknown as SystemGroup);
      subscriber.complete();
    });
  }

  get_systems(): Observable<Array<System>> {
    getSystemsCalls++;
    return of([
      { uid: 'system-uid-1', name: 'system1' },
      { uid: 'system-uid-2', name: 'system2' },
    ] as unknown as Array<System>);
  }

  get_system_group_handle(name: string): Observable<string> {
    expect(name).toBe('testsystemgroup');
    return new Observable((subscriber) => {
      subscriber.next('system-group-handle-1');
      subscriber.complete();
    });
  }

  modify_system_group(
    objectId: string,
    attribute: Array<string>,
    arg: any,
    token: string,
  ): Observable<boolean> {
    expect(objectId).toBe('system-group-handle-1');
    modifyCalls.push({ attribute, arg });
    return new Observable((subscriber) => {
      subscriber.next(true);
      subscriber.complete();
    });
  }

  save_system_group(
    objectId: string,
    withTriggers: boolean,
    withSync: boolean,
    editMode: string,
    token: string,
  ): Observable<boolean> {
    expect(objectId).toBe('system-group-handle-1');
    expect(withTriggers).toBe(false);
    expect(withSync).toBe(false);
    expect(editMode).toBe('');
    saveCalled = true;
    return new Observable((subscriber) => {
      subscriber.next(true);
      subscriber.complete();
    });
  }

  remove_system_group(
    objectId: string,
    token: string,
    recursive?: boolean,
  ): Observable<boolean> {
    // Cobbler 4.0.0 requires the object's uid, not its name.
    expect(objectId).toBe('system-group-uid-1');
    return of(removeReturnValue);
  }

  copy_system_group(
    objectId: string,
    newName: string,
    token: string,
  ): Observable<boolean> {
    expect(objectId).toBe('system-group-handle-1');
    expect(newName).toBe(copyNewName);
    return of(true);
  }
}

describe('SystemGroupEditComponent', () => {
  let component: SystemGroupEditComponent;
  let fixture: ComponentFixture<SystemGroupEditComponent>;

  beforeEach(async () => {
    modifyCalls.length = 0;
    saveCalled = false;
    getSystemGroupCalls = 0;
    getSystemsCalls = 0;
    removeReturnValue = true;
    copyNewName = 'testsystemgroup-copy';

    await TestBed.configureTestingModule({
      imports: [SystemGroupEditComponent, NoopAnimationsModule],
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
                get: () => 'testsystemgroup',
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SystemGroupEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loads the system group via get_system_group on init', () => {
    expect(getSystemGroupCalls).toBe(1);
    expect(component.systemGroup.name).toBe('testsystemgroup');
    expect(component.systemGroupFormGroup.get('members')?.value).toEqual([
      'system-uid-1',
    ]);
  });

  it('populates the members options with uid/name pairs from get_systems', () => {
    expect(getSystemsCalls).toBe(1);
    const membersInput = component.systemGroupEditableInputData.find(
      (input) => input.formControlName === 'members',
    );
    expect(membersInput?.inputType).toBe(
      CobblerInputChoices.MULTI_SELECT_STRICT_DROPDOWN,
    );
    expect(membersInput?.options).toEqual([
      { value: 'system-uid-1', label: 'system1' },
      { value: 'system-uid-2', label: 'system2' },
    ]);
  });

  it('displays the member system names instead of their uids, as linked chips', async () => {
    component.editSystemGroup();
    fixture.detectChanges();
    await fixture.whenStable();

    const chip: HTMLElement =
      fixture.nativeElement.querySelector('mat-chip-row');
    expect(chip.textContent).toContain('system1');
    expect(chip.textContent).not.toContain('system-uid-1');

    const link: HTMLAnchorElement =
      fixture.nativeElement.querySelector('mat-chip-row a');
    expect(link).not.toBeNull();
    expect(link.getAttribute('href')).toEqual('/items/system/system1');
  });

  it('saves the members as uids', () => {
    component.editSystemGroup();
    const membersControl = component.systemGroupFormGroup.get(
      'members',
    ) as unknown as FormControl;
    membersControl.setValue(['system-uid-1', 'system-uid-2']);
    membersControl.markAsDirty();

    component.saveSystemGroup();

    expect(modifyCalls).toEqual([
      { attribute: ['members'], arg: ['system-uid-1', 'system-uid-2'] },
    ]);
    expect(saveCalled).toBe(true);
  });

  it('saves a dirty field via modify_system_group then save_system_group', () => {
    component.editSystemGroup();
    const commentControl = component.systemGroupFormGroup.get(
      'comment',
    ) as unknown as FormControl;
    commentControl.setValue('updated comment');
    commentControl.markAsDirty();

    component.saveSystemGroup();

    expect(modifyCalls).toEqual([
      { attribute: ['comment'], arg: 'updated comment' },
    ]);
    expect(saveCalled).toBe(true);
  });

  it('saves with nothing dirty by calling save_system_group directly and exits edit mode', () => {
    // combineLatest([]) never emits, so saveSystemGroup() must short-circuit around it instead of
    // hanging with modifyObservables empty (no dirty fields).
    component.editSystemGroup();

    component.saveSystemGroup();

    expect(modifyCalls).toEqual([]);
    expect(saveCalled).toBe(true);
    expect(component.isEditMode).toBe(false);
  });

  it('removeSystemGroup navigates to the overview and shows no error on success', () => {
    const router = TestBed.inject(Router);
    const snackBar = TestBed.inject(MatSnackBar);
    const navigateSpy = vi.spyOn(router, 'navigate');
    const snackBarSpy = vi.spyOn(snackBar, 'open');

    component.removeSystemGroup();

    expect(navigateSpy).toHaveBeenCalledWith(['/items', 'system-group']);
    expect(snackBarSpy).not.toHaveBeenCalled();
  });

  it('removeSystemGroup shows an error and does not navigate on failure', () => {
    removeReturnValue = false;
    const router = TestBed.inject(Router);
    const snackBar = TestBed.inject(MatSnackBar);
    const navigateSpy = vi.spyOn(router, 'navigate');
    const snackBarSpy = vi.spyOn(snackBar, 'open');

    component.removeSystemGroup();

    expect(navigateSpy).not.toHaveBeenCalled();
    expect(snackBarSpy).toHaveBeenCalled();
  });

  it('copySystemGroup navigates to the new item under /items/system-group', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate');
    vi.spyOn(component.dialog, 'open').mockReturnValue({
      afterClosed: () => of(copyNewName),
    } as any);

    component.copySystemGroup('system-group-uid-1', 'testsystemgroup');

    expect(navigateSpy).toHaveBeenCalledWith([
      '/items',
      'system-group',
      copyNewName,
    ]);
  });
});

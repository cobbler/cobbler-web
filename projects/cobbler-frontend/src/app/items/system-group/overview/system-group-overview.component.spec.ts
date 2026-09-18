import { Injectable } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { COBBLER_URL, CobblerApiService, SystemGroup } from 'cobbler-api';
import { Observable, of } from 'rxjs';
import { vi } from 'vitest';

import { SystemGroupOverviewComponent } from './system-group-overview.component';

let removeSystemGroupReturnValue = true;

@Injectable()
class MockCobblerApiService extends CobblerApiService {
  lastRemoveSystemGroupArgs: unknown[] | undefined;

  reconfigureService(url: URL) {}

  get_system_groups(): Observable<Array<SystemGroup>> {
    return new Observable((subscriber) => {
      subscriber.next([
        {
          uid: 'system-group-uid-1',
          name: 'testsystemgroup',
          members: ['system1', 'system2'],
        } as unknown as SystemGroup,
      ]);
      subscriber.complete();
    });
  }

  override remove_system_group(
    objectId: string,
    token: string,
    recursive = true,
  ): Observable<boolean> {
    this.lastRemoveSystemGroupArgs = [objectId, token, recursive];
    return of(removeSystemGroupReturnValue);
  }
}

describe('SystemGroupOverviewComponent', () => {
  let component: SystemGroupOverviewComponent;
  let fixture: ComponentFixture<SystemGroupOverviewComponent>;

  beforeEach(async () => {
    removeSystemGroupReturnValue = true;
    await TestBed.configureTestingModule({
      imports: [SystemGroupOverviewComponent],
      providers: [
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
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SystemGroupOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('populates dataSource.data from get_system_groups()', () => {
    expect(component.dataSource.data).toEqual([
      {
        uid: 'system-group-uid-1',
        name: 'testsystemgroup',
        members: ['system1', 'system2'],
      },
    ] as unknown as Array<SystemGroup>);
  });

  it('deletes by uid, not by name (Cobbler 4.0.0 requires an object id for remove_system_group)', () => {
    const mockService = TestBed.inject(
      CobblerApiService,
    ) as MockCobblerApiService;

    component.deleteSystemGroup('system-group-uid-1', 'testsystemgroup');

    // Passing the name ('testsystemgroup') here would silently delete nothing under Cobbler 4.0.0.
    expect(mockService.lastRemoveSystemGroupArgs?.[0]).toEqual(
      'system-group-uid-1',
    );
  });

  it('shows the delete-failed snackbar and does not refresh when remove_system_group returns false', () => {
    removeSystemGroupReturnValue = false;
    const snackBar = TestBed.inject(MatSnackBar);
    const snackBarSpy = vi.spyOn(snackBar, 'open');
    const initialData = component.dataSource.data;

    component.deleteSystemGroup('system-group-uid-1', 'testsystemgroup');

    expect(snackBarSpy).toHaveBeenCalled();
    // The list must not silently refresh as if the delete had succeeded.
    expect(component.dataSource.data).toBe(initialData);
  });
});

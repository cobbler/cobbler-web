import { Injectable } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { COBBLER_URL, CobblerApiService, DistroGroup } from 'cobbler-api';
import { Observable, of } from 'rxjs';
import { vi } from 'vitest';

import { DistroGroupOverviewComponent } from './distro-group-overview.component';

let removeDistroGroupReturnValue = true;

@Injectable()
class MockCobblerApiService extends CobblerApiService {
  lastRemoveDistroGroupArgs: unknown[] | undefined;

  reconfigureService(url: URL) {}

  get_distro_groups(): Observable<Array<DistroGroup>> {
    return new Observable((subscriber) => {
      subscriber.next([
        {
          uid: 'distro-group-uid-1',
          name: 'testdistrogroup',
          members: ['distro1', 'distro2'],
        } as unknown as DistroGroup,
      ]);
      subscriber.complete();
    });
  }

  override remove_distro_group(
    objectId: string,
    token: string,
    recursive = true,
  ): Observable<boolean> {
    this.lastRemoveDistroGroupArgs = [objectId, token, recursive];
    return of(removeDistroGroupReturnValue);
  }
}

describe('DistroGroupOverviewComponent', () => {
  let component: DistroGroupOverviewComponent;
  let fixture: ComponentFixture<DistroGroupOverviewComponent>;

  beforeEach(async () => {
    removeDistroGroupReturnValue = true;
    await TestBed.configureTestingModule({
      imports: [DistroGroupOverviewComponent],
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

    fixture = TestBed.createComponent(DistroGroupOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('populates dataSource.data from get_distro_groups()', () => {
    expect(component.dataSource.data).toEqual([
      {
        uid: 'distro-group-uid-1',
        name: 'testdistrogroup',
        members: ['distro1', 'distro2'],
      },
    ] as unknown as Array<DistroGroup>);
  });

  it('deletes by uid, not by name (Cobbler 4.0.0 requires an object id for remove_distro_group)', () => {
    const mockService = TestBed.inject(
      CobblerApiService,
    ) as MockCobblerApiService;

    component.deleteDistroGroup('distro-group-uid-1', 'testdistrogroup');

    // Passing the name ('testdistrogroup') here would silently delete nothing under Cobbler 4.0.0.
    expect(mockService.lastRemoveDistroGroupArgs?.[0]).toEqual(
      'distro-group-uid-1',
    );
  });

  it('shows the delete-failed snackbar and does not refresh when remove_distro_group returns false', () => {
    removeDistroGroupReturnValue = false;
    const snackBar = TestBed.inject(MatSnackBar);
    const snackBarSpy = vi.spyOn(snackBar, 'open');
    const initialData = component.dataSource.data;

    component.deleteDistroGroup('distro-group-uid-1', 'testdistrogroup');

    expect(snackBarSpy).toHaveBeenCalled();
    // The list must not silently refresh as if the delete had succeeded.
    expect(component.dataSource.data).toBe(initialData);
  });
});

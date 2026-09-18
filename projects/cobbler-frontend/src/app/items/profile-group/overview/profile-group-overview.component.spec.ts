import { Injectable } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { COBBLER_URL, CobblerApiService, ProfileGroup } from 'cobbler-api';
import { Observable, of } from 'rxjs';
import { vi } from 'vitest';

import { ProfileGroupOverviewComponent } from './profile-group-overview.component';

let removeProfileGroupReturnValue = true;

@Injectable()
class MockCobblerApiService extends CobblerApiService {
  lastRemoveProfileGroupArgs: unknown[] | undefined;

  reconfigureService(url: URL) {}

  get_profile_groups(): Observable<Array<ProfileGroup>> {
    return new Observable((subscriber) => {
      subscriber.next([
        {
          uid: 'profile-group-uid-1',
          name: 'testprofilegroup',
          members: ['profile1', 'profile2'],
        } as unknown as ProfileGroup,
      ]);
      subscriber.complete();
    });
  }

  override remove_profile_group(
    objectId: string,
    token: string,
    recursive = true,
  ): Observable<boolean> {
    this.lastRemoveProfileGroupArgs = [objectId, token, recursive];
    return of(removeProfileGroupReturnValue);
  }
}

describe('ProfileGroupOverviewComponent', () => {
  let component: ProfileGroupOverviewComponent;
  let fixture: ComponentFixture<ProfileGroupOverviewComponent>;

  beforeEach(async () => {
    removeProfileGroupReturnValue = true;
    await TestBed.configureTestingModule({
      imports: [ProfileGroupOverviewComponent],
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

    fixture = TestBed.createComponent(ProfileGroupOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('populates dataSource.data from get_profile_groups()', () => {
    expect(component.dataSource.data).toEqual([
      {
        uid: 'profile-group-uid-1',
        name: 'testprofilegroup',
        members: ['profile1', 'profile2'],
      },
    ] as unknown as Array<ProfileGroup>);
  });

  it('deletes by uid, not by name (Cobbler 4.0.0 requires an object id for remove_profile_group)', () => {
    const mockService = TestBed.inject(
      CobblerApiService,
    ) as MockCobblerApiService;

    component.deleteProfileGroup('profile-group-uid-1', 'testprofilegroup');

    // Passing the name ('testprofilegroup') here would silently delete nothing under Cobbler 4.0.0.
    expect(mockService.lastRemoveProfileGroupArgs?.[0]).toEqual(
      'profile-group-uid-1',
    );
  });

  it('shows the delete-failed snackbar and does not refresh when remove_profile_group returns false', () => {
    removeProfileGroupReturnValue = false;
    const snackBar = TestBed.inject(MatSnackBar);
    const snackBarSpy = vi.spyOn(snackBar, 'open');
    const initialData = component.dataSource.data;

    component.deleteProfileGroup('profile-group-uid-1', 'testprofilegroup');

    expect(snackBarSpy).toHaveBeenCalled();
    // The list must not silently refresh as if the delete had succeeded.
    expect(component.dataSource.data).toBe(initialData);
  });
});

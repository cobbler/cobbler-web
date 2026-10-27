import { Injectable } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { COBBLER_URL, CobblerApiService } from 'cobbler-api';
import { Observable } from 'rxjs';

import { SystemGroupCreateComponent } from './system-group-create.component';

const callOrder: string[] = [];

@Injectable()
class MockCobblerApiService extends CobblerApiService {
  reconfigureService(url: URL) {}

  new_system_group(token: string): Observable<string> {
    callOrder.push('new_system_group');
    expect(token).toBe('test-token');
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
    callOrder.push('modify_system_group');
    expect(objectId).toBe('system-group-handle-1');
    expect(attribute).toEqual(['name']);
    expect(arg).toBe('testsystemgroup');
    expect(token).toBe('test-token');
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
    callOrder.push('save_system_group');
    expect(objectId).toBe('system-group-handle-1');
    expect(withTriggers).toBe(false);
    expect(withSync).toBe(false);
    expect(editMode).toBe('new');
    expect(token).toBe('test-token');
    return new Observable((subscriber) => {
      subscriber.next(true);
      subscriber.complete();
    });
  }
}

describe('SystemGroupCreateComponent', () => {
  let component: SystemGroupCreateComponent;
  let fixture: ComponentFixture<SystemGroupCreateComponent>;
  let closedWith: unknown;

  beforeEach(async () => {
    callOrder.length = 0;
    closedWith = undefined;

    await TestBed.configureTestingModule({
      imports: [
        SystemGroupCreateComponent,
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
        {
          provide: CobblerApiService,
          useClass: MockCobblerApiService,
        },
        {
          provide: MatDialogRef,
          useValue: {
            close: (result: unknown) => {
              closedWith = result;
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SystemGroupCreateComponent);
    component = fixture.componentInstance;
    component.userService.token = 'test-token';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('saves in order: new -> modify -> save, then closes with the name', () => {
    component.systemGroupCreateFormGroup.patchValue({
      name: 'testsystemgroup',
    });

    component.createSystemGroup();

    expect(callOrder).toEqual([
      'new_system_group',
      'modify_system_group',
      'save_system_group',
    ]);
    expect(closedWith).toBe('testsystemgroup');
  });
});

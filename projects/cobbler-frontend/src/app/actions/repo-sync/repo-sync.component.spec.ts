import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatListModule } from '@angular/material/list';
import { provideRouter } from '@angular/router';

import { RepoSyncComponent } from './repo-sync.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CobblerApiService, COBBLER_URL } from 'cobbler-api';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('RepoSyncComponent', () => {
  let component: RepoSyncComponent;
  let fixture: ComponentFixture<RepoSyncComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatListModule, RepoSyncComponent, NoopAnimationsModule],
      providers: [
        provideRouter([]),
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
    fixture = TestBed.createComponent(RepoSyncComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not send an only member and pass the selected repos', () => {
    const api = TestBed.inject(CobblerApiService);
    const reposync = vi
      .spyOn(api, 'background_reposync')
      .mockReturnValue(of('task-id'));
    component.reposyncFormGroup.controls.repos.setValue(['repo-uid']);

    component.runReposync();

    expect(reposync).toHaveBeenCalledTimes(1);
    const options = reposync.mock.calls[0][0];
    expect(options).toEqual({ repos: ['repo-uid'], nofail: false, tries: 3 });
    expect('only' in options).toBe(false);
  });
});

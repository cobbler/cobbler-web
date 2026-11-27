import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CobblerApiService, COBBLER_URL } from 'cobbler-api';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { ReplicateComponent } from './replicate.component';

describe('ReplicateComponent', () => {
  let component: ReplicateComponent;
  let fixture: ComponentFixture<ReplicateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReplicateComponent,
        NoopAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: COBBLER_URL,
          useValue: new URL('http://localhost/cobbler_api'),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReplicateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should send all pattern and flag options', () => {
    const api = TestBed.inject(CobblerApiService);
    const replicate = vi
      .spyOn(api, 'background_replicate')
      .mockReturnValue(of('task-id'));
    component.replicateFormGroup.patchValue({
      master: 'master.example.org',
      port: '80',
      distro_patterns: 'd*',
      profile_patterns: 'p*',
      system_patterns: 's*',
      repo_patterns: 'r*',
      image_patterns: 'i*',
      menu_patterns: 'm*',
      template_patterns: 't*',
      network_interface_patterns: 'n*',
      distro_group_patterns: 'dg*',
      profile_group_patterns: 'pg*',
      system_group_patterns: 'sg*',
      prune: true,
      use_ssl: true,
    });

    component.runReplicate();

    expect(replicate).toHaveBeenCalledTimes(1);
    expect(replicate.mock.calls[0][0]).toEqual({
      master: 'master.example.org',
      port: '80',
      distro_patterns: 'd*',
      profile_patterns: 'p*',
      system_patterns: 's*',
      repo_patterns: 'r*',
      image_patterns: 'i*',
      menu_patterns: 'm*',
      template_patterns: 't*',
      network_interface_patterns: 'n*',
      distro_group_patterns: 'dg*',
      profile_group_patterns: 'pg*',
      system_group_patterns: 'sg*',
      prune: true,
      omit_data: false,
      sync_all: false,
      use_ssl: true,
    });
  });
});

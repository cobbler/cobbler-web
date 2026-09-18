import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { CobblerApiService, COBBLER_URL } from 'cobbler-api';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { MkloadersComponent } from './mkloaders.component';

describe('MkloadersComponent', () => {
  let component: MkloadersComponent;
  let fixture: ComponentFixture<MkloadersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MkloadersComponent, MatButtonModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: COBBLER_URL,
          useValue: new URL('http://localhost/cobbler_api'),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MkloadersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should trigger the mkloaders action and not the hardlink action', () => {
    const api = TestBed.inject(CobblerApiService);
    const mkloaders = vi
      .spyOn(api, 'backgroundMkloaders')
      .mockReturnValue(of('task-id'));
    const hardlink = vi.spyOn(api, 'background_hardlink');

    component.runMkloaders();

    expect(mkloaders).toHaveBeenCalledTimes(1);
    expect(hardlink).not.toHaveBeenCalled();
  });
});

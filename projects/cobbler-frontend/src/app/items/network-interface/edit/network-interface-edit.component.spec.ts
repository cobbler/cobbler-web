import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { COBBLER_URL } from 'cobbler-api';

import { NetworkInterfaceEditComponent } from './network-interface-edit.component';

describe('EditComponent', () => {
  let component: NetworkInterfaceEditComponent;
  let fixture: ComponentFixture<NetworkInterfaceEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NetworkInterfaceEditComponent, NoopAnimationsModule],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: COBBLER_URL,
          useValue: new URL('http://localhost/cobbler_api'),
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => 'testsystem',
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NetworkInterfaceEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('has no two editable fields sharing the same label (ambiguous for getByLabel/screen readers)', () => {
    const labels = component.networkInterfaceEditableInputData.map(
      (input) => input.label,
    );
    const duplicates = labels.filter(
      (label, index) => labels.indexOf(label) !== index,
    );
    expect(duplicates).toEqual([]);
  });
});

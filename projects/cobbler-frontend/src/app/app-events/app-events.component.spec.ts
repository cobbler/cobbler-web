import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatListModule } from '@angular/material/list';
import { provideRouter } from '@angular/router';

import { AppEventsComponent } from './app-events.component';
import { MatDialogModule } from '@angular/material/dialog';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { COBBLER_URL } from 'cobbler-api';

describe('AppEventsComponent', () => {
  let component: AppEventsComponent;
  let fixture: ComponentFixture<AppEventsComponent>;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppEventsComponent,
        MatListModule,
        HttpClientTestingModule,
        MatDialogModule,
      ],
      providers: [
        provideRouter([]),
        {
          provide: COBBLER_URL,
          useValue: new URL('http://localhost/cobbler_api'),
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    httpTestingController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(AppEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  it('should create', () => {
    // FIXME: Deduplicate stub with API tests
    // eslint-disable-next-line max-len
    const methodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><struct><member><name>2023-01-24_075223_Create bootable bootloader images_77c9dbafc9234f018d67ec3295fcc22b</name><value><array><data><value><double>1674546743.8418643</double></value><value><string>Create bootable bootloader images</string></value><value><string>complete</string></value><value><array><data><value><string>1YMw1KxyPQtPM8AVB5ejKFJryEHCtCwYQQ==</string></value></data></array></value></data></array></value></member><member><name>2023-01-24_075801_Replicate_ea7a003a81264039b4277ac55664661a</name><value><array><data><value><double>1674547081.1178503</double></value><value><string>Replicate</string></value><value><string>failed</string></value><value><array><data><value><string>1YMw1KxyPQtPM8AVB5ejKFJryEHCtCwYQQ==</string></value></data></array></value></data></array></value></member><member><name>2023-01-24_083001_Build Iso_20fa7d4256fc4f61a2b9c2237c80fb41</name><value><array><data><value><double>1674549001.176315</double></value><value><string>Build Iso</string></value><value><string>failed</string></value><value><array><data><value><string>1YMw1KxyPQtPM8AVB5ejKFJryEHCtCwYQQ==</string></value></data></array></value></data></array></value></member><member><name>2023-01-24_083137_(CLI) ACL Configuration_334327920d2946fda3ac95dbf457e76d</name><value><array><data><value><double>1674549097.240632</double></value><value><string>(CLI) ACL Configuration</string></value><value><string>failed</string></value><value><array><data><value><string>1YMw1KxyPQtPM8AVB5ejKFJryEHCtCwYQQ==</string></value></data></array></value></data></array></value></member></struct></value></param></params></methodResponse>`;
    const mockRequest = httpTestingController.expectOne(
      'http://localhost/cobbler_api',
    );
    mockRequest.flush(methodResponse);
    expect(component).toBeTruthy();
  });
});

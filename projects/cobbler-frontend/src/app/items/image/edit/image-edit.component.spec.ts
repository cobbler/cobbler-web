import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { COBBLER_URL } from 'cobbler-api';

import { ImageEditComponent } from './image-edit.component';

describe('ImageEditComponent', () => {
  let component: ImageEditComponent;
  let fixture: ComponentFixture<ImageEditComponent>;
  let httpTestingController: HttpTestingController;

  // eslint-disable-next-line max-len
  const imageMethodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><struct><member><name>uid</name><value><string>image-uid-1</string></value></member><member><name>name</name><value><string>testimage</string></value></member><member><name>mtime</name><value><double>0</double></value></member><member><name>ctime</name><value><double>0</double></value></member><member><name>network_count</name><value><int>0</int></value></member><member><name>comment</name><value><string></string></value></member><member><name>arch</name><value><string></string></value></member><member><name>autoinstall</name><value><string></string></value></member><member><name>breed</name><value><string></string></value></member><member><name>file</name><value><string></string></value></member><member><name>image_type</name><value><string></string></value></member><member><name>os_version</name><value><string></string></value></member><member><name>boot_loaders</name><value><array><data><value><string>grub</string></value></data></array></value></member><member><name>owners</name><value><array><data></data></array></value></member></struct></value></param></params></methodResponse>`;

  const bootloadersResponse = `<?xml version='1.0'?><methodResponse><params><param><value><array><data><value><string>grub</string></value></data></array></value></param></params></methodResponse>`;

  const trueResponse = `<?xml version='1.0'?><methodResponse><params><param><value><boolean>1</boolean></value></param></params></methodResponse>`;

  const handleResponse = `<?xml version='1.0'?><methodResponse><params><param><value><string>test-image-handle</string></value></param></params></methodResponse>`;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageEditComponent, NoopAnimationsModule],
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
                get: () => 'testimage',
              },
            },
          },
        },
      ],
    }).compileComponents();

    httpTestingController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(ImageEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('saves with nothing dirty by calling save_image directly and exits edit mode', () => {
    // combineLatest([]) never emits, so saveImage() must short-circuit around it instead of
    // hanging with modifyObservables empty (no dirty fields).
    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>get_image</methodName>'),
      )
      .flush(imageMethodResponse);
    httpTestingController
      .expectOne((req) =>
        req.body.includes(
          '<methodName>get_valid_image_boot_loaders</methodName>',
        ),
      )
      .flush(bootloadersResponse);

    component.editImage();

    component.saveImage();

    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>get_image_handle</methodName>'),
      )
      .flush(handleResponse);

    httpTestingController.expectNone((req) =>
      req.body.includes('<methodName>modify_image</methodName>'),
    );

    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>save_image</methodName>'),
      )
      .flush(trueResponse);

    expect(component.isEditMode).toBe(false);
  });
});

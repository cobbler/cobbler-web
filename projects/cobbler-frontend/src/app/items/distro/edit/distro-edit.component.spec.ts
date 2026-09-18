import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { COBBLER_URL } from 'cobbler-api';

import { DistroEditComponent } from './distro-edit.component';

describe('DistroEditComponent', () => {
  let component: DistroEditComponent;
  let fixture: ComponentFixture<DistroEditComponent>;
  let httpTestingController: HttpTestingController;

  // eslint-disable-next-line max-len
  const distroMethodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><struct><member><name>uid</name><value><string>distro-uid-1</string></value></member><member><name>name</name><value><string>testdistro</string></value></member><member><name>mtime</name><value><double>0</double></value></member><member><name>ctime</name><value><double>0</double></value></member><member><name>tree_build_time</name><value><double>0</double></value></member><member><name>remote_grub_initrd</name><value><string></string></value></member><member><name>remote_grub_kernel</name><value><string></string></value></member><member><name>arch</name><value><string></string></value></member><member><name>breed</name><value><string></string></value></member><member><name>comment</name><value><string></string></value></member><member><name>kernel</name><value><string></string></value></member><member><name>initrd</name><value><string></string></value></member><member><name>remote_boot_kernel</name><value><string></string></value></member><member><name>remote_boot_initrd</name><value><string></string></value></member><member><name>os_version</name><value><string></string></value></member><member><name>redhat_management_key</name><value><string></string></value></member><member><name>boot_loaders</name><value><array><data><value><string>grub</string></value></data></array></value></member><member><name>owners</name><value><array><data></data></array></value></member><member><name>autoinstall_meta</name><value><struct></struct></value></member><member><name>kernel_options</name><value><struct></struct></value></member><member><name>kernel_options_post</name><value><struct></struct></value></member><member><name>template_files</name><value><struct></struct></value></member></struct></value></param></params></methodResponse>`;

  const bootloadersResponse = `<?xml version='1.0'?><methodResponse><params><param><value><array><data><value><string>grub</string></value></data></array></value></param></params></methodResponse>`;

  const breedsResponse = `<?xml version='1.0'?><methodResponse><params><param><value><array><data><value><string>redhat</string></value></data></array></value></param></params></methodResponse>`;

  const trueResponse = `<?xml version='1.0'?><methodResponse><params><param><value><boolean>1</boolean></value></param></params></methodResponse>`;

  const handleResponse = `<?xml version='1.0'?><methodResponse><params><param><value><string>test-distro-handle</string></value></param></params></methodResponse>`;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DistroEditComponent, NoopAnimationsModule],
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
                get: () => 'testdistro',
              },
            },
          },
        },
      ],
    }).compileComponents();

    httpTestingController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(DistroEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // refreshData() now resolves the route's name to a uid via get_distro_handle() before
    // calling the now-uid-only get_distro().
    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>get_distro_handle</methodName>'),
      )
      .flush(handleResponse);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('saves with nothing dirty by calling save_distro directly and exits edit mode', () => {
    // combineLatest([]) never emits, so saveDistro() must short-circuit around it instead of
    // hanging with modifyObservables empty (no dirty fields).
    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>get_distro</methodName>'),
      )
      .flush(distroMethodResponse);
    httpTestingController
      .expectOne((req) =>
        req.body.includes(
          '<methodName>get_valid_distro_boot_loaders</methodName>',
        ),
      )
      .flush(bootloadersResponse);
    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>get_valid_breeds</methodName>'),
      )
      .flush(breedsResponse);

    component.editDistro();

    component.saveDistro();

    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>get_distro_handle</methodName>'),
      )
      .flush(handleResponse);

    httpTestingController.expectNone((req) =>
      req.body.includes('<methodName>modify_distro</methodName>'),
    );

    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>save_distro</methodName>'),
      )
      .flush(trueResponse);

    expect(component.isEditMode).toBe(false);
  });
});

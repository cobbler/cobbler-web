import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { COBBLER_URL } from 'cobbler-api';

import { RepositoryEditComponent } from './repository-edit.component';

describe('RepositoryEditComponent', () => {
  let component: RepositoryEditComponent;
  let fixture: ComponentFixture<RepositoryEditComponent>;
  let httpTestingController: HttpTestingController;

  // eslint-disable-next-line max-len
  const repoMethodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><struct><member><name>uid</name><value><string>repo-uid-1</string></value></member><member><name>name</name><value><string>testrepository</string></value></member><member><name>mtime</name><value><double>0</double></value></member><member><name>ctime</name><value><double>0</double></value></member><member><name>priority</name><value><int>0</int></value></member><member><name>keep_updated</name><value><boolean>0</boolean></value></member><member><name>mirror_locally</name><value><boolean>0</boolean></value></member><member><name>comment</name><value><string></string></value></member><member><name>proxy</name><value><string></string></value></member><member><name>mirror_type</name><value><string></string></value></member><member><name>mirror</name><value><string></string></value></member><member><name>breed</name><value><string></string></value></member><member><name>os_version</name><value><string></string></value></member><member><name>rpm_list</name><value><array><data></data></array></value></member><member><name>owners</name><value><array><data></data></array></value></member><member><name>environment</name><value><struct></struct></value></member><member><name>yumopts</name><value><struct></struct></value></member><member><name>rsyncopts</name><value><struct></struct></value></member></struct></value></param></params></methodResponse>`;

  const trueResponse = `<?xml version='1.0'?><methodResponse><params><param><value><boolean>1</boolean></value></param></params></methodResponse>`;

  const handleResponse = `<?xml version='1.0'?><methodResponse><params><param><value><string>test-repo-handle</string></value></param></params></methodResponse>`;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepositoryEditComponent, NoopAnimationsModule],
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
                get: () => 'testrepository',
              },
            },
          },
        },
      ],
    }).compileComponents();

    httpTestingController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(RepositoryEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('saves with nothing dirty by calling save_repo directly and exits edit mode', () => {
    // combineLatest([]) never emits, so saveRepository() must short-circuit around it instead of
    // hanging with modifyObservables empty (no dirty fields).
    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>get_repo</methodName>'),
      )
      .flush(repoMethodResponse);

    component.editRepository();

    component.saveRepository();

    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>get_repo_handle</methodName>'),
      )
      .flush(handleResponse);

    httpTestingController.expectNone((req) =>
      req.body.includes('<methodName>modify_repo</methodName>'),
    );

    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>save_repo</methodName>'),
      )
      .flush(trueResponse);

    expect(component.isEditMode).toBe(false);
  });
});

import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  ActivatedRoute,
  provideRouter,
  convertToParamMap,
} from '@angular/router';
import { of } from 'rxjs';
import { COBBLER_URL } from 'cobbler-api';

import { expectSaveArguments } from '../../save-arguments.testing';
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
            paramMap: of(convertToParamMap({ name: 'testrepository' })),
          },
        },
      ],
    }).compileComponents();

    httpTestingController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(RepositoryEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // refreshData() now resolves the route's name to a uid via get_repo_handle() before
    // calling the now-uid-only get_repo().
    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>get_repo_handle</methodName>'),
      )
      .flush(handleResponse);
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

    const saveRequest = httpTestingController.expectOne((req) =>
      req.body.includes('<methodName>save_repo</methodName>'),
    );
    expectSaveArguments(saveRequest.request.body, 'bypass');
    saveRequest.flush(trueResponse);

    expect(component.isEditMode).toBe(false);
  });

  it('populates createrepo_flags and the readonly depth/is_subobject controls', () => {
    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>get_repo</methodName>'),
      )
      .flush(
        repoMethodResponse.replace(
          '</struct></value></param></params>',
          '<member><name>createrepo_flags</name><value><string>-c cache</string></value></member><member><name>depth</name><value><int>1</int></value></member><member><name>is_subobject</name><value><boolean>1</boolean></value></member></struct></value></param></params>',
        ),
      );

    expect(component.repositoryFormGroup.get('createrepo_flags').value).toBe(
      '-c cache',
    );
    expect(component.repositoryReadonlyFormGroup.get('depth').value).toBe(1);
    expect(
      component.repositoryReadonlyFormGroup.get('is_subobject').value,
    ).toBe(true);
  });

  it('has no redhat_management_key field', () => {
    expect(
      component.repositoryFormGroup.get('redhat_management_key'),
    ).toBeNull();
    expect(
      component.repositoryEditableInputData.some(
        (m) => m.formControlName === 'redhat_management_key',
      ),
    ).toBe(false);
  });

  it('patches apt components and dists from repository.apt', () => {
    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>get_repo</methodName>'),
      )
      .flush(
        repoMethodResponse.replace(
          '</struct></value></param></params>',
          '<member><name>apt</name><value><struct><member><name>components</name><value><array><data><value><string>main</string></value><value><string>contrib</string></value></data></array></value></member><member><name>dists</name><value><array><data><value><string>bookworm</string></value></data></array></value></member></struct></value></member></struct></value></param></params>',
        ),
      );

    expect(component.repositoryFormGroup.get('apt_components').value).toEqual([
      'main',
      'contrib',
    ]);
    expect(component.repositoryFormGroup.get('apt_dists').value).toEqual([
      'bookworm',
    ]);
  });

  it('saves apt fields via the nested apt attribute path', () => {
    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>get_repo</methodName>'),
      )
      .flush(repoMethodResponse);
    component.editRepository();
    component.repositoryFormGroup
      .get('apt_components')
      .setValue(['main'] as never);
    component.repositoryFormGroup.get('apt_components').markAsDirty();
    component.repositoryFormGroup
      .get('apt_dists')
      .setValue(['bookworm'] as never);
    component.repositoryFormGroup.get('apt_dists').markAsDirty();

    component.saveRepository();

    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>get_repo_handle</methodName>'),
      )
      .flush(handleResponse);

    // The modifies are sent one after another, each only once the previous one was answered.
    const bodies: Array<string> = [];
    for (let index = 0; index < 2; index++) {
      const modify = httpTestingController.expectOne((req) =>
        req.body.includes('<methodName>modify_repo</methodName>'),
      );
      bodies.push(modify.request.body as string);
      modify.flush(trueResponse);
    }
    expect(
      bodies.some(
        (b) =>
          b.includes('<string>apt</string>') &&
          b.includes('<string>components</string>') &&
          b.includes('<string>main</string>'),
      ),
    ).toBe(true);
    expect(
      bodies.some(
        (b) =>
          b.includes('<string>apt</string>') &&
          b.includes('<string>dists</string>') &&
          b.includes('<string>bookworm</string>'),
      ),
    ).toBe(true);
    expect(bodies.some((b) => b.includes('apt_components'))).toBe(false);
  });
});

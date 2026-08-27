import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { COBBLER_URL } from 'cobbler-api';

import { UserService } from '../../../services/user.service';
import Utils from '../../../utils';
import { TemplateEditComponent } from './template-edit.component';

describe('TemplateEditComponent', () => {
  let component: TemplateEditComponent;
  let fixture: ComponentFixture<TemplateEditComponent>;
  let httpTestingController: HttpTestingController;
  let userService: UserService;

  const TEMPLATE_UID = 'aabbccddeeff00112233445566778899';
  const TOKEN = 'test-token-abc';

  // A synthetic but well-formed Cobbler 4.0.0 get_template response. Deliberately has NO
  // `content` member: the real backend name-mangles Template.__content to `_Template__content`,
  // so `BaseItem._is_dict_key()` skips it entirely during serialization (see the doc comment on
  // `Template.content` in custom-types/items.ts). This is confirmed against a live cobblerd via
  // `get_template()`, which never returns a `content` key.
  // eslint-disable-next-line max-len
  const templateMethodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><struct><member><name>uid</name><value><string>${TEMPLATE_UID}</string></value></member><member><name>name</name><value><string>testtemplate</string></value></member><member><name>mtime</name><value><double>1787509606.0302052</double></value></member><member><name>ctime</name><value><double>1787509606.0302052</double></value></member><member><name>comment</name><value><string></string></value></member><member><name>owners</name><value><array><data></data></array></value></member><member><name>template_type</name><value><string>cheetah</string></value></member><member><name>uri</name><value><struct><member><name>schema</name><value><string>file</string></value></member><member><name>authority</name><value><string></string></value></member><member><name>path</name><value><string>testtemplate.template</string></value></member><member><name>query</name><value><string></string></value></member><member><name>fragment</name><value><string></string></value></member></struct></value></member><member><name>built_in</name><value><boolean>0</boolean></value></member><member><name>tags</name><value><array><data></data></array></value></member></struct></value></param></params></methodResponse>`;

  /** Builds a `get_template_content` response carrying the raw string directly (no wrapping struct). */
  function templateContentResponse(content: string): string {
    return `<?xml version='1.0'?><methodResponse><params><param><value><string>${content}</string></value></param></params></methodResponse>`;
  }

  const handleResponse = `<?xml version='1.0'?><methodResponse><params><param><value><string>test-template-handle</string></value></param></params></methodResponse>`;

  const trueResponse = `<?xml version='1.0'?><methodResponse><params><param><value><boolean>1</boolean></value></param></params></methodResponse>`;

  /** Parses a captured XML-RPC request body and asserts that it is well-formed XML. */
  function parseRequestBody(body: string): Document {
    expect(typeof body).toEqual('string');
    const document = new DOMParser().parseFromString(body, 'text/xml');
    expect(document.getElementsByTagName('parsererror').length).toEqual(0);
    return document;
  }

  /** Returns the ``<value>`` element of the n-th ``<param>`` of a serialized ``<methodCall>``. */
  function paramValue(document: Document, index: number): Element {
    const params = document.getElementsByTagName('param');
    expect(params.length).toBeGreaterThan(index);
    const value = params[index].firstElementChild;
    expect(value).not.toBeNull();
    expect(value?.tagName).toEqual('value');
    return value as Element;
  }

  function valueToJs(value: Element): any {
    const typed = value.firstElementChild as Element;
    switch (typed.tagName) {
      case 'string':
        return typed.textContent ?? '';
      case 'boolean':
        return typed.textContent === '1';
      case 'array':
        return Array.from(typed.getElementsByTagName('data')[0].children).map(
          (element) => valueToJs(element),
        );
      default:
        throw new Error(`Unsupported value type "${typed.tagName}"`);
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemplateEditComponent, NoopAnimationsModule],
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
                get: () => 'testtemplate',
              },
            },
          },
        },
      ],
    }).compileComponents();

    httpTestingController = TestBed.inject(HttpTestingController);
    userService = TestBed.inject(UserService);
    userService.token = TOKEN;

    fixture = TestBed.createComponent(TemplateEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loads content via get_template_content (not the never-present value.content) using the resolved uid and current token', () => {
    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>get_template_handle</methodName>'),
      )
      .flush(handleResponse);
    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>get_template</methodName>'),
      )
      .flush(templateMethodResponse);

    const contentRequest = httpTestingController.expectOne((req) =>
      req.body.includes('<methodName>get_template_content</methodName>'),
    );
    const document = parseRequestBody(contentRequest.request.body);
    expect(valueToJs(paramValue(document, 0))).toEqual(TEMPLATE_UID);
    expect(valueToJs(paramValue(document, 1))).toEqual(TOKEN);

    const realContent =
      "# Start preseed_early_default\n$SNIPPET('built-in-autoinstall_start')\n# End preseed_early_default";
    contentRequest.flush(templateContentResponse(realContent));

    expect(component.templateFormGroup.get('content').value).toEqual(
      Utils.toHTML(realContent),
    );
  });

  it('populates the readonly fields and the newly enabled editable fields (owners, template_type, tags, uri.*)', () => {
    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>get_template_handle</methodName>'),
      )
      .flush(handleResponse);
    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>get_template</methodName>'),
      )
      .flush(templateMethodResponse);
    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>get_template_content</methodName>'),
      )
      .flush(templateContentResponse('some content'));

    expect(component.templateReadonlyFormGroup.get('name').value).toEqual(
      'testtemplate',
    );
    expect(component.templateReadonlyFormGroup.get('uid').value).toEqual(
      TEMPLATE_UID,
    );
    expect(component.templateReadonlyFormGroup.get('built_in').value).toEqual(
      false,
    );
    expect(component.templateFormGroup.get('template_type').value).toEqual(
      'cheetah',
    );
    expect(component.templateFormGroup.get('tags').value).toEqual([]);
    expect(component.templateFormGroup.get('uri_schema').value).toEqual('file');
    expect(component.templateFormGroup.get('uri_path').value).toEqual(
      'testtemplate.template',
    );
    expect(component.templateFormGroup.get('owners_inherited').value).toEqual(
      false,
    );
    expect(component.templateFormGroup.get('owners').value).toEqual([]);
  });

  it('saveTemplate() still sends modify_template(handle, ["content"], value, token) and reloads the saved content via get_template_content', () => {
    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>get_template_handle</methodName>'),
      )
      .flush(handleResponse);
    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>get_template</methodName>'),
      )
      .flush(templateMethodResponse);
    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>get_template_content</methodName>'),
      )
      .flush(templateContentResponse('original content v1'));

    component.editTemplate();
    component.templateFormGroup.patchValue({
      content: 'updated content v2 - round trip works',
    });
    component.templateFormGroup.get('content').markAsDirty();

    component.saveTemplate();

    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>get_template_handle</methodName>'),
      )
      .flush(handleResponse);

    const modifyRequest = httpTestingController.expectOne((req) =>
      req.body.includes('<methodName>modify_template</methodName>'),
    );
    const modifyDocument = parseRequestBody(modifyRequest.request.body);
    expect(valueToJs(paramValue(modifyDocument, 0))).toEqual(
      'test-template-handle',
    );
    expect(valueToJs(paramValue(modifyDocument, 1))).toEqual(['content']);
    expect(valueToJs(paramValue(modifyDocument, 2))).toEqual(
      'updated content v2 - round trip works',
    );
    modifyRequest.flush(trueResponse);

    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>save_template</methodName>'),
      )
      .flush(trueResponse);

    // saveTemplate() success triggers refreshData() again, which must re-fetch content via
    // get_template_content rather than trusting the (never-present) value.content.
    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>get_template_handle</methodName>'),
      )
      .flush(handleResponse);
    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>get_template</methodName>'),
      )
      .flush(templateMethodResponse);

    const reloadContentRequest = httpTestingController.expectOne((req) =>
      req.body.includes('<methodName>get_template_content</methodName>'),
    );
    reloadContentRequest.flush(
      templateContentResponse('updated content v2 - round trip works'),
    );

    expect(component.templateFormGroup.get('content').value).toEqual(
      Utils.toHTML('updated content v2 - round trip works'),
    );
  });

  it('writes uri_* form fields back via their real nested uri.* attribute path', () => {
    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>get_template_handle</methodName>'),
      )
      .flush(handleResponse);
    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>get_template</methodName>'),
      )
      .flush(templateMethodResponse);
    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>get_template_content</methodName>'),
      )
      .flush(templateContentResponse('some content'));

    component.editTemplate();
    component.templateFormGroup.patchValue({
      uri_path: 'new-path.template',
    });
    component.templateFormGroup.get('uri_path').markAsDirty();

    component.saveTemplate();

    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>get_template_handle</methodName>'),
      )
      .flush(handleResponse);

    const modifyRequest = httpTestingController.expectOne((req) =>
      req.body.includes('<methodName>modify_template</methodName>'),
    );
    const modifyDocument = parseRequestBody(modifyRequest.request.body);
    expect(valueToJs(paramValue(modifyDocument, 1))).toEqual(['uri', 'path']);
    expect(valueToJs(paramValue(modifyDocument, 2))).toEqual(
      'new-path.template',
    );
  });

  it('saves with nothing dirty by calling save_template directly and exits edit mode', () => {
    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>get_template_handle</methodName>'),
      )
      .flush(handleResponse);
    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>get_template</methodName>'),
      )
      .flush(templateMethodResponse);
    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>get_template_content</methodName>'),
      )
      .flush(templateContentResponse('some content'));

    component.editTemplate();
    component.saveTemplate();

    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>get_template_handle</methodName>'),
      )
      .flush(handleResponse);

    httpTestingController.expectNone((req) =>
      req.body.includes('<methodName>modify_template</methodName>'),
    );

    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>save_template</methodName>'),
      )
      .flush(trueResponse);

    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>get_template_handle</methodName>'),
      )
      .flush(handleResponse);
    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>get_template</methodName>'),
      )
      .flush(templateMethodResponse);
    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>get_template_content</methodName>'),
      )
      .flush(templateContentResponse('some content'));

    expect(component.isEditMode).toEqual(false);
  });
});

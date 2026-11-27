import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  ActivatedRoute,
  ParamMap,
  Router,
  provideRouter,
  convertToParamMap,
} from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { vi } from 'vitest';
import { COBBLER_URL } from 'cobbler-api';

import { expectSaveArguments } from '../../save-arguments.testing';
import { DistroEditComponent } from './distro-edit.component';

describe('DistroEditComponent', () => {
  let component: DistroEditComponent;
  let fixture: ComponentFixture<DistroEditComponent>;
  let httpTestingController: HttpTestingController;
  let paramMap: BehaviorSubject<ParamMap>;

  // eslint-disable-next-line max-len
  const distroMethodResponse = `<?xml version='1.0'?><methodResponse><params><param><value><struct><member><name>uid</name><value><string>distro-uid-1</string></value></member><member><name>name</name><value><string>testdistro</string></value></member><member><name>mtime</name><value><double>0</double></value></member><member><name>ctime</name><value><double>0</double></value></member><member><name>tree_build_time</name><value><double>0</double></value></member><member><name>remote_grub_initrd</name><value><string></string></value></member><member><name>remote_grub_kernel</name><value><string></string></value></member><member><name>arch</name><value><string></string></value></member><member><name>breed</name><value><string></string></value></member><member><name>comment</name><value><string></string></value></member><member><name>kernel</name><value><string></string></value></member><member><name>initrd</name><value><string></string></value></member><member><name>remote_boot_kernel</name><value><string></string></value></member><member><name>remote_boot_initrd</name><value><string></string></value></member><member><name>remote_boot_iso</name><value><string></string></value></member><member><name>os_version</name><value><string></string></value></member><member><name>redhat_management_key</name><value><string></string></value></member><member><name>boot_loaders</name><value><array><data><value><string>grub</string></value></data></array></value></member><member><name>owners</name><value><array><data></data></array></value></member><member><name>autoinstall_meta</name><value><struct></struct></value></member><member><name>kernel_options</name><value><struct></struct></value></member><member><name>kernel_options_post</name><value><struct></struct></value></member><member><name>template_files</name><value><struct></struct></value></member></struct></value></param></params></methodResponse>`;

  const bootloadersResponse = `<?xml version='1.0'?><methodResponse><params><param><value><array><data><value><string>grub</string></value></data></array></value></param></params></methodResponse>`;

  const breedsResponse = `<?xml version='1.0'?><methodResponse><params><param><value><array><data><value><string>redhat</string></value></data></array></value></param></params></methodResponse>`;

  const trueResponse = `<?xml version='1.0'?><methodResponse><params><param><value><boolean>1</boolean></value></param></params></methodResponse>`;

  const handleResponse = `<?xml version='1.0'?><methodResponse><params><param><value><string>test-distro-handle</string></value></param></params></methodResponse>`;

  beforeEach(async () => {
    paramMap = new BehaviorSubject(convertToParamMap({ name: 'testdistro' }));
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
            paramMap,
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

  function flushDistroLoad(distroResponse = distroMethodResponse): void {
    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>get_distro</methodName>'),
      )
      .flush(distroResponse);
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
  }

  function setDirty(control: string, value: unknown): void {
    const formControl = component.distroFormGroup.get(control);
    formControl.setValue(value);
    formControl.markAsDirty();
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('modifies strictly one attribute at a time, breed before os_version before boot_loaders', () => {
    flushDistroLoad();
    component.editDistro();
    // The form (and with it the dirty map) lists comment and boot_loaders before breed.
    setDirty('os_version', 'rhel9');
    setDirty('boot_loaders', ['grub']);
    setDirty('comment', 'changed');
    setDirty('breed', 'redhat');

    component.saveDistro();
    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>get_distro_handle</methodName>'),
      )
      .flush(handleResponse);

    for (const attribute of [
      'breed',
      'os_version',
      'boot_loaders',
      'comment',
    ]) {
      // expectOne fails if a second modify was already sent before this one was answered.
      const modifyRequest = httpTestingController.expectOne((req) =>
        req.body.includes('<methodName>modify_distro</methodName>'),
      );
      expect(modifyRequest.request.body).toContain(
        `<string>${attribute}</string>`,
      );
      httpTestingController.expectNone((req) =>
        req.body.includes('<methodName>save_distro</methodName>'),
      );
      modifyRequest.flush(trueResponse);
    }

    const saveRequest = httpTestingController.expectOne((req) =>
      req.body.includes('<methodName>save_distro</methodName>'),
    );
    expectSaveArguments(saveRequest.request.body, 'bypass');
    saveRequest.flush(trueResponse);
    expect(component.isEditMode).toBe(false);
  });

  it('stops after a failing modify, shows the error and does not save', () => {
    flushDistroLoad();
    component.editDistro();
    setDirty('breed', 'redhat');
    setDirty('os_version', 'rhel9');
    const snackBarSpy = vi.spyOn(component['_snackBar'], 'open');

    component.saveDistro();
    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>get_distro_handle</methodName>'),
      )
      .flush(handleResponse);
    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>modify_distro</methodName>'),
      )
      .flush(
        `<?xml version='1.0'?><methodResponse><fault><value><struct><member><name>faultCode</name><value><int>1</int></value></member><member><name>faultString</name><value><string>invalid breed</string></value></member></struct></value></fault></methodResponse>`,
      );

    httpTestingController.expectNone((req) =>
      req.body.includes('<methodName>modify_distro</methodName>'),
    );
    httpTestingController.expectNone((req) =>
      req.body.includes('<methodName>save_distro</methodName>'),
    );
    expect(snackBarSpy).toHaveBeenCalled();
    expect(component.isEditMode).toBe(true);
    expect(component.saving).toBe(false);
  });

  it('ignores a second save while one is in flight and disables the save button meanwhile', () => {
    flushDistroLoad();
    component.editDistro();
    setDirty('comment', 'changed');

    component.saveDistro();
    component.saveDistro();
    expect(component.saving).toBe(true);
    fixture.detectChanges();
    const saveButton: HTMLButtonElement = fixture.nativeElement.querySelector(
      '[data-testid="item-save-button"]',
    );
    expect(saveButton.disabled).toBe(true);

    // Only one modify/save sequence was started.
    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>get_distro_handle</methodName>'),
      )
      .flush(handleResponse);
    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>modify_distro</methodName>'),
      )
      .flush(trueResponse);
    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>save_distro</methodName>'),
      )
      .flush(trueResponse);

    expect(component.saving).toBe(false);
  });

  it('allows saving again after a failed save', () => {
    flushDistroLoad();
    component.editDistro();

    component.saveDistro();
    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>get_distro_handle</methodName>'),
      )
      .flush('', { status: 500, statusText: 'Internal Server Error' });
    expect(component.saving).toBe(false);

    component.saveDistro();
    httpTestingController.expectOne((req) =>
      req.body.includes('<methodName>get_distro_handle</methodName>'),
    );
  });

  it('reloads the item shown when the route name changes, e.g. after copying', () => {
    flushDistroLoad();
    const copyHandleResponse = handleResponse.replace(
      'test-distro-handle',
      'copy-distro-handle',
    );

    paramMap.next(convertToParamMap({ name: 'testdistro-copy' }));

    expect(component.name).toBe('testdistro-copy');
    const handleRequest = httpTestingController.expectOne((req) =>
      req.body.includes('<methodName>get_distro_handle</methodName>'),
    );
    expect(handleRequest.request.body).toContain(
      '<string>testdistro-copy</string>',
    );
    handleRequest.flush(copyHandleResponse);
    const getRequest = httpTestingController.expectOne((req) =>
      req.body.includes('<methodName>get_distro</methodName>'),
    );
    expect(getRequest.request.body).toContain(
      '<string>copy-distro-handle</string>',
    );
    getRequest.flush(
      distroMethodResponse
        .replace('distro-uid-1', 'distro-uid-2')
        .replace(
          '<string>testdistro</string>',
          '<string>testdistro-copy</string>',
        ),
    );
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

    expect(component.distro.uid).toBe('distro-uid-2');
    expect(component.distroReadonlyFormGroup.get('name').value).toBe(
      'testdistro-copy',
    );

    // Saving now targets the copy, not the original item.
    component.editDistro();
    component.saveDistro();
    expect(
      httpTestingController.expectOne((req) =>
        req.body.includes('<methodName>get_distro_handle</methodName>'),
      ).request.body,
    ).toContain('<string>testdistro-copy</string>');
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

    const saveRequest = httpTestingController.expectOne((req) =>
      req.body.includes('<methodName>save_distro</methodName>'),
    );
    expectSaveArguments(saveRequest.request.body, 'bypass');
    saveRequest.flush(trueResponse);

    expect(component.isEditMode).toBe(false);
  });

  function flushRefresh(): void {
    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>get_distro_handle</methodName>'),
      )
      .flush(handleResponse);
    flushDistroLoad();
  }

  function expectSingleModifyOf(attribute: string): void {
    component.saveDistro();
    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>get_distro_handle</methodName>'),
      )
      .flush(handleResponse);
    const modifyRequest = httpTestingController.expectOne((req) =>
      req.body.includes('<methodName>modify_distro</methodName>'),
    );
    expect(modifyRequest.request.body).toContain(
      `<string>${attribute}</string>`,
    );
    modifyRequest.flush(trueResponse);
    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>save_distro</methodName>'),
      )
      .flush(trueResponse);
  }

  it('marks the form pristine after a successful save so stale fields are not re-sent', () => {
    flushDistroLoad();
    component.editDistro();
    setDirty('breed', 'redhat');
    expectSingleModifyOf('breed');
    expect(component.distroFormGroup.dirty).toBe(false);
    flushRefresh();

    component.editDistro();
    setDirty('comment', 'changed');
    expectSingleModifyOf('comment');
  });

  it('marks the form pristine when the edit is cancelled', () => {
    flushDistroLoad();
    component.editDistro();
    setDirty('breed', 'redhat');
    vi.spyOn(component.dialog, 'open').mockReturnValue({
      afterClosed: () => of(true),
    } as never);
    component.cancelEdit();
    expect(component.distroFormGroup.dirty).toBe(false);
    flushRefresh();

    component.editDistro();
    setDirty('comment', 'changed');
    expectSingleModifyOf('comment');
  });

  it('navigates without a failure snackbar when the delete succeeded', () => {
    flushDistroLoad();
    const navigate = vi
      .spyOn(TestBed.inject(Router), 'navigate')
      .mockResolvedValue(true);
    const open = vi.spyOn(component['_snackBar'], 'open');
    component.removeDistro();
    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>remove_distro</methodName>'),
      )
      .flush(trueResponse);
    expect(navigate).toHaveBeenCalledWith(['/items', 'distro']);
    expect(open).not.toHaveBeenCalled();
  });

  it('shows the failure snackbar and stays when the delete returned false', () => {
    flushDistroLoad();
    const navigate = vi
      .spyOn(TestBed.inject(Router), 'navigate')
      .mockResolvedValue(true);
    const open = vi.spyOn(component['_snackBar'], 'open');
    component.removeDistro();
    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>remove_distro</methodName>'),
      )
      .flush(trueResponse.replace('<boolean>1', '<boolean>0'));
    expect(navigate).not.toHaveBeenCalled();
    expect(open).toHaveBeenCalledTimes(1);
  });

  it('treats the list sentinel as inherited and does not make template_files inheritable', () => {
    httpTestingController
      .expectOne((req) =>
        req.body.includes('<methodName>get_distro</methodName>'),
      )
      .flush(
        distroMethodResponse
          .replace(
            '<name>boot_loaders</name><value><array><data><value><string>grub</string></value></data></array></value>',
            '<name>boot_loaders</name><value><array><data><value><string>&lt;&lt;inherit&gt;&gt;</string></value></data></array></value>',
          )
          .replace(
            '<member><name>template_files</name><value><struct></struct></value></member>',
            '<member><name>template_files</name><value><struct><member><name>a</name><value><string>b</string></value></member></struct></value></member><member><name>depth</name><value><int>2</int></value></member><member><name>is_subobject</name><value><boolean>1</boolean></value></member>',
          ),
      );
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

    expect(component.distroFormGroup.get('boot_loaders_inherited').value).toBe(
      true,
    );
    expect(component.distroFormGroup.get('boot_loaders').value).toEqual([
      'grub',
    ]);
    expect(
      component.distroFormGroup.get('template_files_inherited'),
    ).toBeNull();
    expect(component.distroFormGroup.get('template_files').value).toEqual({
      a: 'b',
    });
    expect(component.distroReadonlyFormGroup.get('depth').value).toBe(2);
    expect(component.distroReadonlyFormGroup.get('is_subobject').value).toBe(
      true,
    );

    component.editDistro();
    expect(component.distroFormGroup.get('boot_loaders').disabled).toBe(true);
    expect(component.distroFormGroup.get('template_files').enabled).toBe(true);
  });
});

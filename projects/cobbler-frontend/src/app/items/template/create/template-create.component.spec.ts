import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { COBBLER_URL } from 'cobbler-api';

import { TemplateCreateComponent } from './template-create.component';

describe('TemplateCreateComponent', () => {
  let component: TemplateCreateComponent;
  let fixture: ComponentFixture<TemplateCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TemplateCreateComponent,
        MatButtonModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatInputModule,
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: COBBLER_URL,
          useValue: new URL('http://localhost/cobbler_api'),
        },
        {
          provide: MatDialogRef,
          useValue: { close: vi.fn() },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TemplateCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  const xmlResponse = (inner: string) =>
    `<?xml version='1.0'?><methodResponse><params><param><value>${inner}</value></param></params></methodResponse>`;
  const faultResponse = (message: string) =>
    `<?xml version='1.0'?><methodResponse><fault><value><struct><member><name>faultCode</name><value><int>1</int></value></member><member><name>faultString</name><value><string>${message}</string></value></member></struct></value></fault></methodResponse>`;

  const namesArray = (...names: string[]) =>
    `<array><data>${names.map((n) => `<value><string>${n}</string></value>`).join('')}</data></array>`;

  function flushNext(method: string, body: string): void {
    const http = TestBed.inject(HttpTestingController);
    http
      .expectOne((req) =>
        req.body.includes(`<methodName>${method}</methodName>`),
      )
      .flush(body);
  }

  function runCreateUntilPathStep(): void {
    component.templateCreateFormGroup.patchValue({ name: 'new.template' });
    component.createTemplate();
    flushNext('get_item_names', xmlResponse(namesArray('other.template')));
    flushNext('new_template', xmlResponse('<string>h</string>'));
    flushNext('modify_template', xmlResponse('<boolean>1</boolean>'));
    flushNext('modify_template', xmlResponse('<boolean>1</boolean>'));
    flushNext('modify_template', xmlResponse('<boolean>1</boolean>'));
  }

  it('explains autoinstall_templates_allow_new_files on a path validation error', () => {
    const open = vi.spyOn(TestBed.inject(MatSnackBar), 'open');
    runCreateUntilPathStep();
    flushNext(
      'modify_template',
      faultResponse('Additional path validation failed!'),
    );
    expect(open).toHaveBeenCalledTimes(1);
    const message = open.mock.calls[0][0];
    expect(message).toContain('Additional path validation failed!');
    expect(message).toContain('autoinstall_templates_allow_new_files: true');
  });

  it('shows only the server message for unrelated errors', () => {
    const open = vi.spyOn(TestBed.inject(MatSnackBar), 'open');
    runCreateUntilPathStep();
    flushNext('modify_template', faultResponse('Something else broke'));
    const message = open.mock.calls[0][0];
    expect(message).toContain('Something else broke');
    expect(message).not.toContain('autoinstall_templates_allow_new_files');
  });

  it('refuses an existing template name before creating anything', () => {
    const http = TestBed.inject(HttpTestingController);
    const open = vi.spyOn(TestBed.inject(MatSnackBar), 'open');
    component.templateCreateFormGroup.patchValue({ name: 'existing.ks' });
    component.createTemplate();
    flushNext('get_item_names', xmlResponse(namesArray('existing.ks')));
    http.expectNone((req) =>
      req.body.includes('<methodName>new_template</methodName>'),
    );
    http.expectNone((req) =>
      req.body.includes('<methodName>modify_template</methodName>'),
    );
    expect(open).toHaveBeenCalledTimes(1);
    expect(open.mock.calls[0][0]).toContain('already exists');
  });

  it('proceeds with the creation flow for an unused template name', () => {
    const open = vi.spyOn(TestBed.inject(MatSnackBar), 'open');
    runCreateUntilPathStep();
    flushNext('modify_template', xmlResponse('<boolean>1</boolean>'));
    flushNext('modify_template', xmlResponse('<boolean>1</boolean>'));
    flushNext('save_template', xmlResponse('<boolean>1</boolean>'));
    expect(TestBed.inject(MatDialogRef).close).toHaveBeenCalledWith(
      'new.template',
    );
    expect(open).not.toHaveBeenCalled();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { PreferencesComponent } from './preferences.component';

describe('PreferencesComponent', () => {
  let component: PreferencesComponent;
  let fixture: ComponentFixture<PreferencesComponent>;
  let originalBaseURI: PropertyDescriptor | undefined;

  function stubBaseURI(baseURI: string): void {
    Object.defineProperty(Document.prototype, 'baseURI', {
      value: baseURI,
      configurable: true,
    });
  }

  async function createComponent(): Promise<void> {
    await TestBed.configureTestingModule({
      imports: [PreferencesComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(PreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  beforeEach(() => {
    originalBaseURI = Object.getOwnPropertyDescriptor(
      Document.prototype,
      'baseURI',
    );
  });

  afterEach(() => {
    if (originalBaseURI) {
      Object.defineProperty(Document.prototype, 'baseURI', originalBaseURI);
    }
  });

  it('should create', async () => {
    await createComponent();
    expect(component).toBeTruthy();
  });

  it('detects the current locale from a root base href', async () => {
    stubBaseURI('http://localhost/en-US/');
    await createComponent();
    expect(component.currentLocale).toBe('en-US');
  });

  it('detects the current locale from a subpath-prefixed base href', async () => {
    stubBaseURI('http://localhost/cobbler_web/de/');
    await createComponent();
    expect(component.currentLocale).toBe('de');
  });

  it('falls back to en-US when the base href has no recognized locale', async () => {
    stubBaseURI('http://localhost/');
    await createComponent();
    expect(component.currentLocale).toBe('en-US');
  });

  describe('onLanguageChange', () => {
    let originalLocation: Location;

    beforeEach(() => {
      originalLocation = window.location;
      Object.defineProperty(window, 'location', {
        value: { href: '' },
        writable: true,
        configurable: true,
      });
    });

    afterEach(() => {
      Object.defineProperty(window, 'location', {
        value: originalLocation,
        writable: true,
        configurable: true,
      });
    });

    it('preserves the domain root when switching locale', async () => {
      stubBaseURI('http://localhost/en-US/');
      await createComponent();

      component.onLanguageChange('de');

      expect(window.location.href).toBe('http://localhost/de/');
    });

    it('preserves the subpath prefix when switching locale', async () => {
      stubBaseURI('http://localhost/cobbler_web/en-US/');
      await createComponent();

      component.onLanguageChange('de');

      expect(window.location.href).toBe('http://localhost/cobbler_web/de/');
    });
  });
});

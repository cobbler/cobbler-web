import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import {
  MultiSelectStrictComponent,
  MultiSelectStrictOption,
} from './multi-select-strict.component';

describe('MultiSelectStrictComponent', () => {
  let component: MultiSelectStrictComponent;
  let fixture: ComponentFixture<MultiSelectStrictComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultiSelectStrictComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(MultiSelectStrictComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  async function setOptions(
    options: Array<MultiSelectStrictOption>,
  ): Promise<void> {
    fixture.componentRef.setInput('options', options);
    await fixture.whenStable();
  }

  async function renderedOptionTexts(): Promise<Array<string>> {
    // The options are only attached to the DOM once the select panel is open.
    const selectTrigger: HTMLElement = fixture.nativeElement.querySelector(
      '.mat-mdc-select-trigger',
    );
    selectTrigger.click();
    await fixture.whenStable();
    return Array.from(document.querySelectorAll('mat-option')).map((option) =>
      option.textContent.trim(),
    );
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('plain string options (backwards compatible)', () => {
    beforeEach(async () => {
      await setOptions(['alpha', 'beta']);
    });

    it('uses the string itself as both value and label', () => {
      expect(component.optionValue('alpha')).toBe('alpha');
      expect(component.optionLabel('alpha')).toBe('alpha');
    });

    it('resolves the trigger label to the value itself', () => {
      expect(component.labelForValue('beta')).toBe('beta');
    });

    it('renders the strings as option texts', async () => {
      expect(await renderedOptionTexts()).toEqual(['alpha', 'beta']);
    });

    it('shows the raw value in the trigger', async () => {
      component.writeValue(['beta']);
      // writeValue() bypasses change detection, so the view has to be marked dirty explicitly.
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      const trigger: HTMLElement =
        fixture.nativeElement.querySelector('mat-select-trigger');
      expect(trigger.textContent).toContain('beta');
    });
  });

  describe('value/label options', () => {
    beforeEach(async () => {
      await setOptions([
        { value: 'uid-1', label: 'distro1' },
        { value: 'uid-2', label: 'distro2' },
      ]);
    });

    it('separates the stored value from the displayed label', () => {
      expect(component.optionValue({ value: 'uid-1', label: 'distro1' })).toBe(
        'uid-1',
      );
      expect(component.optionLabel({ value: 'uid-1', label: 'distro1' })).toBe(
        'distro1',
      );
    });

    it('resolves the trigger label from the stored value', () => {
      expect(component.labelForValue('uid-2')).toBe('distro2');
    });

    it('falls back to the raw value for unknown values', () => {
      expect(component.labelForValue('uid-unknown')).toBe('uid-unknown');
    });

    it('renders the labels instead of the stored uids', async () => {
      expect(await renderedOptionTexts()).toEqual(['distro1', 'distro2']);
    });

    it('shows the label of the first selected value in the trigger', async () => {
      component.writeValue(['uid-2', 'uid-1']);
      // writeValue() bypasses change detection, so the view has to be marked dirty explicitly.
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      const trigger: HTMLElement =
        fixture.nativeElement.querySelector('mat-select-trigger');
      expect(trigger.textContent).toContain('distro2');
      expect(trigger.textContent).not.toContain('uid-2');
      expect(trigger.textContent).toContain('(+1');
    });

    it('propagates the stored values on selection change', () => {
      const changes: Array<Array<string>> = [];
      component.registerOnChange((value) => changes.push(value));

      component.selectionChange(['uid-1']);

      expect(changes).toEqual([['uid-1']]);
      expect(component.value).toEqual(['uid-1']);
    });
  });

  it('tolerates an undefined options list', () => {
    component.options = undefined;
    expect(component.labelForValue('uid-1')).toBe('uid-1');
  });
});

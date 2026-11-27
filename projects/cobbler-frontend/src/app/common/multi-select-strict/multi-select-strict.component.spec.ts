import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

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
      providers: [provideRouter([])],
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

  /** The chip's label text, excluding the remove button's "cancel" icon ligature text. */
  function renderedChipTexts(): Array<string> {
    return Array.from(
      fixture.nativeElement.querySelectorAll('mat-chip-row'),
    ).map((chip: HTMLElement) => {
      const clone = chip.cloneNode(true) as HTMLElement;
      clone.querySelector('[matChipRemove]')?.remove();
      return clone.textContent.trim();
    });
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

    it('resolves the label to the value itself', () => {
      expect(component.labelForValue('beta')).toBe('beta');
    });

    it('renders selected values as chips showing the raw string', async () => {
      component.writeValue(['alpha', 'beta']);
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(renderedChipTexts()).toEqual(['alpha', 'beta']);
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

    it('resolves the label from the stored value', () => {
      expect(component.labelForValue('uid-2')).toBe('distro2');
    });

    it('falls back to the raw value for unknown values', () => {
      expect(component.labelForValue('uid-unknown')).toBe('uid-unknown');
    });

    it('renders the labels instead of the stored uids as chips', async () => {
      component.writeValue(['uid-2', 'uid-1']);
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(renderedChipTexts()).toEqual(['distro2', 'distro1']);
    });

    it('links each chip to its item edit page when itemRoute is set', async () => {
      fixture.componentRef.setInput('itemRoute', ['/items', 'distro']);
      component.writeValue(['uid-1']);
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      const link: HTMLAnchorElement =
        fixture.nativeElement.querySelector('mat-chip-row a');
      expect(link).not.toBeNull();
      expect(link.textContent.trim()).toEqual('distro1');
    });

    it('renders plain text (no link) when itemRoute is not set', async () => {
      component.writeValue(['uid-1']);
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(fixture.nativeElement.querySelector('mat-chip-row a')).toBeNull();
    });

    it('adds the picked option to the value and propagates via onChange', () => {
      const changes: Array<Array<string>> = [];
      component.registerOnChange((value) => changes.push(value));
      component.writeValue(['uid-1']);

      component.selected({ option: { value: 'uid-2' } } as any);

      expect(component.value).toEqual(['uid-1', 'uid-2']);
      expect(changes).toEqual([['uid-1', 'uid-2']]);
    });

    it('does not add the same option twice', () => {
      const changes: Array<Array<string>> = [];
      component.registerOnChange((value) => changes.push(value));
      component.writeValue(['uid-1']);

      component.selected({ option: { value: 'uid-1' } } as any);

      expect(component.value).toEqual(['uid-1']);
      expect(changes).toEqual([]);
    });

    it('removes a value and propagates via onChange', () => {
      const changes: Array<Array<string>> = [];
      component.registerOnChange((value) => changes.push(value));
      component.writeValue(['uid-1', 'uid-2']);

      component.remove('uid-1');

      expect(component.value).toEqual(['uid-2']);
      expect(changes).toEqual([['uid-2']]);
    });

    it('excludes already-selected values from the autocomplete suggestions', () => {
      component.writeValue(['uid-1']);

      expect(component.filteredOptions).toEqual([
        { value: 'uid-2', label: 'distro2' },
      ]);
    });

    it('filters autocomplete suggestions by label or uid as the user types', () => {
      component.writeValue([]);

      component.inputControl.setValue('distro2');
      expect(component.filteredOptions).toEqual([
        { value: 'uid-2', label: 'distro2' },
      ]);

      component.inputControl.setValue('uid-1');
      expect(component.filteredOptions).toEqual([
        { value: 'uid-1', label: 'distro1' },
      ]);
    });
  });

  it('tolerates an undefined options list', () => {
    component.options = undefined;
    expect(component.labelForValue('uid-1')).toBe('uid-1');
  });
});

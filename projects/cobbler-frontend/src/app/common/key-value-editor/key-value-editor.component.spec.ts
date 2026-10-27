import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { describe, expect, it, vi } from 'vitest';

import { KeyValueEditorComponent } from './key-value-editor.component';

describe('KeyValueEditorComponent', () => {
  let component: KeyValueEditorComponent;
  let fixture: ComponentFixture<KeyValueEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KeyValueEditorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KeyValueEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('operates on a plain Record<string, any> rather than a Map', () => {
    expect(component.keyValueOptions).toEqual({});
    expect(component.keyOrder).toEqual([]);
  });

  it('writeValue accepts a plain object and builds the key order + form group', () => {
    component.writeValue({ a: '1', b: '2' });

    expect(component.keyValueOptions).toEqual({ a: '1', b: '2' });
    expect(component.keyOrder).toEqual(['a', 'b']);
    expect(component.keyOrderFormGroup.get('aFormGroup')).toBeTruthy();
    expect(component.keyOrderFormGroup.get('bFormGroup')).toBeTruthy();
    expect(component.keyOrderFormGroup.get('aFormGroup.value')?.value).toEqual(
      '1',
    );
  });

  it('writeValue throws when passed a Map instead of a plain object', () => {
    expect(() => component.writeValue(new Map([['a', '1']]) as any)).toThrow(
      "obj wasn't of type Record<string, any>!",
    );
  });

  it('writeValue throws when passed an array', () => {
    expect(() => component.writeValue(['a', '1'] as any)).toThrow(
      "obj wasn't of type Record<string, any>!",
    );
  });

  it('writeValue throws when passed null', () => {
    expect(() => component.writeValue(null as any)).toThrow(
      "obj wasn't of type Record<string, any>!",
    );
  });

  it('deleteKey removes the key and reports a plain object via onChange', () => {
    component.writeValue({ a: '1', b: '2' });
    const onChange = vi.fn();
    component.onChange = onChange;
    component.onTouched = vi.fn();

    component.deleteKey('a');

    expect(onChange).toHaveBeenCalledWith({ b: '2' });
    expect(component.keyValueOptions).toEqual({ b: '2' });
    expect(component.keyOrder).toEqual(['b']);
  });

  it('addOption merges the dialog result into a new plain object via onChange', () => {
    component.writeValue({ a: '1' });
    const onChange = vi.fn();
    component.onChange = onChange;
    component.onTouched = vi.fn();

    const dialog = TestBed.inject(MatDialog);
    vi.spyOn(dialog, 'open').mockReturnValue({
      afterClosed: () => of({ key: 'b', value: '2' }),
    } as any);

    component.addOption();

    expect(onChange).toHaveBeenCalledWith({ a: '1', b: '2' });
    expect(component.keyValueOptions).toEqual({ a: '1', b: '2' });
    expect(component.keyOrder).toEqual(['a', 'b']);
  });
});

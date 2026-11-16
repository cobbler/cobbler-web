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

  it('operates on a Map, matching the Dict wire format', () => {
    expect(component.keyValueOptions).toEqual(new Map());
    expect(component.keyOrder).toEqual([]);
  });

  it('writeValue accepts a Map and builds the key order + form group', () => {
    component.writeValue(
      new Map([
        ['a', '1'],
        ['b', '2'],
      ]),
    );

    expect(component.keyValueOptions).toEqual(
      new Map([
        ['a', '1'],
        ['b', '2'],
      ]),
    );
    expect(component.keyOrder).toEqual(['a', 'b']);
    expect(component.keyOrderFormGroup.get('aFormGroup')).toBeTruthy();
    expect(component.keyOrderFormGroup.get('bFormGroup')).toBeTruthy();
    expect(component.keyOrderFormGroup.get('aFormGroup.value')?.value).toEqual(
      '1',
    );
  });

  it('writeValue throws when passed a plain object instead of a Map', () => {
    expect(() => component.writeValue({ a: '1' } as any)).toThrow(
      "obj wasn't of type Map!",
    );
  });

  it('writeValue throws when passed null', () => {
    expect(() => component.writeValue(null as any)).toThrow(
      "obj wasn't of type Map!",
    );
  });

  it('deleteKey removes the key and reports a Map via onChange', () => {
    component.writeValue(
      new Map([
        ['a', '1'],
        ['b', '2'],
      ]),
    );
    const onChange = vi.fn();
    component.onChange = onChange;
    component.onTouched = vi.fn();

    component.deleteKey('a');

    expect(onChange).toHaveBeenCalledWith(new Map([['b', '2']]));
    expect(component.keyValueOptions).toEqual(new Map([['b', '2']]));
    expect(component.keyOrder).toEqual(['b']);
  });

  it('addOption merges the dialog result into a new Map via onChange', () => {
    component.writeValue(new Map([['a', '1']]));
    const onChange = vi.fn();
    component.onChange = onChange;
    component.onTouched = vi.fn();

    const dialog = TestBed.inject(MatDialog);
    vi.spyOn(dialog, 'open').mockReturnValue({
      afterClosed: () => of({ key: 'b', value: '2' }),
    } as any);

    component.addOption();

    expect(onChange).toHaveBeenCalledWith(
      new Map([
        ['a', '1'],
        ['b', '2'],
      ]),
    );
    expect(component.keyValueOptions).toEqual(
      new Map([
        ['a', '1'],
        ['b', '2'],
      ]),
    );
    expect(component.keyOrder).toEqual(['a', 'b']);
  });

  it('writeValue defaults to simple mode for flat data', () => {
    component.writeValue(
      new Map([
        ['a', '1'],
        ['b', '2'],
      ]),
    );
    expect(component.mode).toEqual('simple');
  });

  it('writeValue auto-selects json mode when a value is nested', () => {
    component.writeValue(
      new Map<string, any>([
        ['flat', '1'],
        ['nested', { x: '2' }],
      ]),
    );
    expect(component.mode).toEqual('json');
    expect(JSON.parse(component.jsonText)).toEqual({
      flat: '1',
      nested: { x: '2' },
    });
  });

  it('writeValue renders nested Maps (as produced by XML-RPC struct deserialization) as real nested JSON, not {}', () => {
    component.writeValue(
      new Map<string, any>([
        [
          'user-data',
          new Map<string, any>([
            ['users', [new Map<string, any>([['name', 'a']])]],
          ]),
        ],
      ]),
    );
    expect(component.mode).toEqual('json');
    expect(JSON.parse(component.jsonText)).toEqual({
      'user-data': { users: [{ name: 'a' }] },
    });
  });

  it('applyJsonText commits a valid nested object as nested Maps via onChange', () => {
    component.writeValue(new Map());
    const onChange = vi.fn();
    component.onChange = onChange;
    component.onTouched = vi.fn();

    const nested = {
      'user-data': { users: [{ name: 'a', groups: ['sudo'] }] },
    };
    // XML-RPC has no plain-object wire type - every dict is a Map here, nested ones included,
    // so JSON.parse()'s plain objects must be converted all the way down before they're sent.
    const expected = new Map<string, any>([
      [
        'user-data',
        new Map<string, any>([
          [
            'users',
            [
              new Map<string, any>([
                ['name', 'a'],
                ['groups', ['sudo']],
              ]),
            ],
          ],
        ]),
      ],
    ]);
    component.applyJsonText(JSON.stringify(nested));

    expect(component.jsonError).toBeNull();
    expect(onChange).toHaveBeenCalledWith(expected);
    expect(component.keyValueOptions).toEqual(expected);
  });

  it('applyJsonText sets jsonError on malformed JSON and does not call onChange', () => {
    component.writeValue(new Map());
    const onChange = vi.fn();
    component.onChange = onChange;
    component.onTouched = vi.fn();

    component.applyJsonText('{ not valid json');

    expect(component.jsonError).not.toBeNull();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('applyJsonText rejects a non-object top level (array)', () => {
    component.writeValue(new Map());
    const onChange = vi.fn();
    component.onChange = onChange;

    component.applyJsonText('[1,2,3]');

    expect(component.jsonError).not.toBeNull();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('applyJsonText rejects a null anywhere in the structure, with a clear error, no silent crash', () => {
    component.writeValue(new Map());
    const onChange = vi.fn();
    component.onChange = onChange;

    component.applyJsonText(
      JSON.stringify({ test: 'test', test2: { 'lorem-ipsum': null } }),
    );

    expect(component.jsonError).not.toBeNull();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('applyJsonText rejects a null nested inside an array', () => {
    component.writeValue(new Map());
    const onChange = vi.fn();
    component.onChange = onChange;

    component.applyJsonText(JSON.stringify({ list: ['a', null] }));

    expect(component.jsonError).not.toBeNull();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('onJsonInput extracts the textarea value and delegates to applyJsonText', () => {
    component.writeValue(new Map());
    const spy = vi
      .spyOn(component, 'applyJsonText')
      .mockImplementation(() => {});
    const event = { target: { value: '{"a":"1"}' } } as unknown as Event;

    component.onJsonInput(event);

    expect(spy).toHaveBeenCalledWith('{"a":"1"}');
  });

  it('validate returns an error only in json mode with a pending jsonError', () => {
    component.writeValue(new Map([['a', '1']]));
    expect(component.validate(null as any)).toBeNull();

    component.switchToJson();
    component.applyJsonText('not json');
    expect(component.validate(null as any)).toEqual({
      invalidJson: component.jsonError,
    });
  });

  it('switchToSimple is a no-op while jsonError is set', () => {
    component.writeValue(new Map([['a', '1']]));
    component.switchToJson();
    component.applyJsonText('not json');

    component.switchToSimple();

    expect(component.mode).toEqual('json');
  });

  it('switchToSimple returns to simple mode once valid', () => {
    component.writeValue(new Map([['a', '1']]));
    component.switchToJson();

    component.switchToSimple();

    expect(component.mode).toEqual('simple');
  });

  it('switchToSimple is a no-op while the current value is nested, even with no jsonError', () => {
    component.writeValue(new Map<string, any>([['nested', { x: '1' }]]));
    expect(component.mode).toEqual('json');
    expect(component.jsonError).toBeNull();

    component.switchToSimple();

    expect(component.mode).toEqual('json');
  });
});

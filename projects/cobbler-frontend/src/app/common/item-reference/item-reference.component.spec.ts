import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ItemReferenceComponent } from './item-reference.component';

describe('ItemReferenceComponent', () => {
  let component: ItemReferenceComponent;
  let fixture: ComponentFixture<ItemReferenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemReferenceComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ItemReferenceComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('writeValue sets the underlying control to the raw uid without emitting onChange', () => {
    let changeCalls = 0;
    component.registerOnChange(() => changeCalls++);

    component.writeValue('distro-uid-1');

    expect(component.innerControl.value).toEqual('distro-uid-1');
    expect(changeCalls).toEqual(0);
  });

  it('propagates user edits of the raw uid via onChange', () => {
    const changes: (string | null)[] = [];
    component.registerOnChange((value) => changes.push(value));

    component.innerControl.setValue('distro-uid-2');

    expect(changes).toEqual(['distro-uid-2']);
  });

  it('resolves the current uid to its matching option', () => {
    component.options = [
      { value: 'distro-uid-1', label: 'ubuntu-24.04' },
      { value: 'distro-uid-2', label: 'rocky-9' },
    ];

    component.writeValue('distro-uid-2');

    expect(component.resolvedOption).toEqual({
      value: 'distro-uid-2',
      label: 'rocky-9',
    });
  });

  it('has no resolved option for an empty or unmatched uid', () => {
    component.options = [{ value: 'distro-uid-1', label: 'ubuntu-24.04' }];

    component.writeValue('');
    expect(component.resolvedOption).toBeUndefined();

    component.writeValue('some-uid-not-in-options');
    expect(component.resolvedOption).toBeUndefined();
  });

  it('setDisabledState disables and re-enables the underlying control', () => {
    component.setDisabledState(true);
    expect(component.innerControl.disabled).toBe(true);

    component.setDisabledState(false);
    expect(component.innerControl.disabled).toBe(false);
  });

  it('offers all options as autocomplete suggestions for an empty value', () => {
    component.options = [
      { value: 'distro-uid-1', label: 'ubuntu-24.04' },
      { value: 'distro-uid-2', label: 'rocky-9' },
    ];

    component.writeValue('');

    expect(component.filteredOptions).toEqual(component.options);
  });

  it('filters autocomplete suggestions by label or uid as the user types', () => {
    component.options = [
      { value: 'distro-uid-1', label: 'ubuntu-24.04' },
      { value: 'distro-uid-2', label: 'rocky-9' },
    ];
    component.writeValue('');

    component.innerControl.setValue('rocky');
    expect(component.filteredOptions).toEqual([
      { value: 'distro-uid-2', label: 'rocky-9' },
    ]);

    component.innerControl.setValue('distro-uid-1');
    expect(component.filteredOptions).toEqual([
      { value: 'distro-uid-1', label: 'ubuntu-24.04' },
    ]);

    component.innerControl.setValue('no-such-match');
    expect(component.filteredOptions).toEqual([]);
  });

  it('re-filters suggestions once options arrive asynchronously after the current value is set', () => {
    component.writeValue('distro-uid-2');
    expect(component.filteredOptions).toEqual([]);

    component.options = [
      { value: 'distro-uid-1', label: 'ubuntu-24.04' },
      { value: 'distro-uid-2', label: 'rocky-9' },
    ];
    component.ngOnChanges({
      options: {
        previousValue: [],
        currentValue: component.options,
        firstChange: false,
        isFirstChange: () => false,
      },
    });

    expect(component.filteredOptions).toEqual([
      { value: 'distro-uid-2', label: 'rocky-9' },
    ]);
  });
});

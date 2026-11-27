import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { BehaviorSubject, of, Subject, throwError } from 'rxjs';
import { vi } from 'vitest';
import Utils from './utils';

describe('Utils', () => {
  it('deduplicateDirtyValues should return the correct values', () => {
    const result = Utils.deduplicateDirtyValues(undefined, {
      redhat_management_key: '<<inherit>>',
      boot_loaders: ['grub', 'pxe', 'ipxe'],
      boot_loaders_inherited: true,
    });
    expect(result).toEqual(
      new Map<string, any>([
        ['redhat_management_key', '<<inherit>>'],
        ['boot_loaders', '<<inherit>>'],
      ]),
    );
  });

  it('isInherited recognizes the scalar and the list form of the sentinel', () => {
    expect(Utils.isInherited('<<inherit>>')).toBe(true);
    expect(Utils.isInherited(['<<inherit>>'])).toBe(true);
    expect(Utils.isInherited('grub')).toBe(false);
    expect(Utils.isInherited(['<<inherit>>', 'grub'])).toBe(false);
    expect(Utils.isInherited(['grub'])).toBe(false);
    expect(Utils.isInherited([])).toBe(false);
    expect(Utils.isInherited({})).toBe(false);
    expect(Utils.isInherited(0)).toBe(false);
    expect(Utils.isInherited(undefined)).toBe(false);
  });

  it('patchFormGroupInherited ticks the checkbox for the one-element list sentinel', () => {
    const group = new FormBuilder().group({
      boot_loaders: [[] as string[]],
      boot_loaders_inherited: [false],
    });
    Utils.patchFormGroupInherited(group, ['<<inherit>>'], 'boot_loaders', [
      'grub',
      'ipxe',
    ]);
    expect(group.value.boot_loaders).toEqual(['grub', 'ipxe']);
    expect(group.value.boot_loaders_inherited).toBe(true);
  });

  it('patchFormGroupInherited keeps concrete values and unticks the checkbox', () => {
    const group = new FormBuilder().group({
      boot_loaders: [[] as string[]],
      boot_loaders_inherited: [true],
    });
    Utils.patchFormGroupInherited(group, ['grub'], 'boot_loaders', ['ipxe']);
    expect(group.value.boot_loaders).toEqual(['grub']);
    expect(group.value.boot_loaders_inherited).toBe(false);
  });

  describe('modifySequentially', () => {
    it('emits once without calling modify when nothing is dirty', () => {
      const modify = vi.fn(() => of(true));
      let emissions = 0;
      let completed = false;
      Utils.modifySequentially(new Map(), modify).subscribe({
        next: () => emissions++,
        complete: () => (completed = true),
      });
      expect(modify).not.toHaveBeenCalled();
      expect(emissions).toBe(1);
      expect(completed).toBe(true);
    });

    it('only starts the next modify after the previous one completed, priority keys first', () => {
      const pending = new Map<string, Subject<boolean>>();
      const started: Array<string> = [];
      let emissions = 0;
      Utils.modifySequentially(
        new Map<string, any>([
          ['comment', 'c'],
          ['os_version', 'rhel9'],
          ['breed', 'redhat'],
        ]),
        (attribute) => {
          started.push(attribute);
          const subject = new Subject<boolean>();
          pending.set(attribute, subject);
          return subject;
        },
        ['breed', 'os_version'],
      ).subscribe(() => emissions++);

      expect(started).toEqual(['breed']);
      pending.get('breed').next(true);
      pending.get('breed').complete();
      expect(started).toEqual(['breed', 'os_version']);
      pending.get('os_version').next(true);
      pending.get('os_version').complete();
      expect(started).toEqual(['breed', 'os_version', 'comment']);
      expect(emissions).toBe(0);
      pending.get('comment').next(true);
      pending.get('comment').complete();
      expect(emissions).toBe(1);
    });

    it('stops at the first failing modify and reports its error', () => {
      const started: Array<string> = [];
      let error: Error;
      Utils.modifySequentially(
        new Map<string, any>([
          ['breed', 'redhat'],
          ['os_version', 'rhel9'],
        ]),
        (attribute) => {
          started.push(attribute);
          return attribute === 'breed'
            ? throwError(() => new Error('invalid breed'))
            : of(true);
        },
      ).subscribe({ error: (err) => (error = err) });
      expect(started).toEqual(['breed']);
      expect(error.message).toBe('invalid breed');
    });
  });

  it('routeParamChanges emits the parameter now and whenever it changes', () => {
    const paramMap = new BehaviorSubject(convertToParamMap({ name: 'a' }));
    const names: Array<string> = [];
    Utils.routeParamChanges(
      { paramMap } as unknown as ActivatedRoute,
      'name',
    ).subscribe((name) => names.push(name));
    paramMap.next(convertToParamMap({ name: 'a' }));
    paramMap.next(convertToParamMap({ name: 'b' }));
    expect(names).toEqual(['a', 'b']);
  });
});

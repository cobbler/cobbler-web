import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MngclassesService {
  // mockdata python=>JS conversion
  // python Bool => JS bool
  // python None => 'None'
  // python method() => 'method()'
  mockdata = [
  ['class_name', '', 0, 'Class Name', true, 'Actual Class Name (leave blank to use the name field)', 0, 'str'],
  ['comment', '', 0, 'Comment', true, 'Free form text description', 0, 'str'],
  ['files', [], 0, 'Files', true, 'File resources', 0, 'list'],
  ['name', '', 0, 'Name', true, 'Ex: F10-i386-webserver', 0, 'str'],
  ['owners', 'SETTINGS:default_ownership', 'SETTINGS:default_ownership', 'Owners', true,
    'Owners list for authz_ownership (space delimited)', 0, 'list'],
  ['packages', [], 0, 'Packages', true, 'Package resources', 0, 'list'],
  ['params', {}, 0, 'Parameters/Variables', true, 'List of parameters/variables', 0, 'dict'],
];

  constructor() { }

  getAll(): any[] {
    return this.mockdata;
  }
}

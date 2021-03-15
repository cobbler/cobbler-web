import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PackagesService {
  // mockdata python=>JS conversion
  // python Bool => JS bool
  // python None => 'None'
  // python method() => 'method()'
  mockdata = [
    ['action', 'create', 0, 'Action', true, 'Install or remove package resource', 0, 'str'],
    ['comment', '', 0, 'Comment', true, 'Free form text description', 0, 'str'],
    ['installer', 'yum', 0, 'Installer', true, 'Package Manager', 0, 'str'],
    ['name', '', 0, 'Name', true, 'Name of file resource', 0, 'str'],
    ['owners', 'SETTINGS:default_ownership', 0, 'Owners', true, 'Owners list for authz_ownership (space delimited)', [], 'list'],
    ['version', '', 0, 'Version', true, 'Package Version', 0, 'str'],
  ];

  constructor() {
  }

  getAll(): any[] {
    return this.mockdata;
  }
}

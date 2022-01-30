import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FilesService {
  // from: https://github.com/cobbler/cobbler/blob/master/cobbler/items/file.py
  // index for this FIELDS[0-3]  are not UI editable
  // mockdata is FIELDS[4-13]
  // mockdata:  Replace(Python=>JS)
  // 'True'=> 'true'
  // 'None'=> 'Null'
  // 'False'=>'false'
  // Are we going to need a converter to swap these out in data request/post ?
  mockdata = [
    ['action', 'create', 0, 'Action', true, 'Create or remove file resource', 0, 'str'],
    ['comment', '', 0, 'Comment', true, 'Free form text description', 0, 'str'],
    ['group', '', 0, 'Owner group in file system', true, 'File owner group in file system', 0, 'str'],
    ['is_dir', false, 0, 'Is Directory', true, 'Treat file resource as a directory', 0, 'bool'],
    ['mode', '', 0, 'Mode', true, 'The mode of the file', 0, 'str'],
    ['name', '', 0, 'Name', true, 'Name of file resource', 0, 'str'],
    ['owner', '', 0, 'Owner user in file system', true, 'File owner user in file system', 0, 'str'],
    ['owners', 'SETTINGS:default_ownership', 0, 'Owners', true, 'Owners list for authz_ownership (space delimited)',
      [], 'list'],
    ['path', '', 0, 'Path', true, 'The path for the file', 0, 'str'],
    ['template', '', 0, 'Template', true, 'The template for the file', 0, 'str']
  ];

  constructor() {
  }

  getAll(): any[] {
    return this.mockdata;
  }
}

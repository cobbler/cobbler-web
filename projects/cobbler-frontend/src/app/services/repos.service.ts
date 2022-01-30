import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReposService {
  // mockdata python=>JS conversion
  // python Bool => JS bool
  // python None => ''None''
  // python method() => 'method()'
  mockdata = [
    ['apt_components', '', 0, 'Apt Components (apt only)', true, 'ex: main restricted universe', [], 'list'],
    ['apt_dists', '', 0, 'Apt Dist Names (apt only)', true, 'ex: precise precise-updates', [], 'list'],
    ['arch', 'x86_64', 0, 'Arch', true, 'ex: i386, x86_64', ['i386', 'x86_64', 'ia64', 'ppc', 'ppc64', 'ppc64le',
      'ppc64el', 's390', 's390x', 'arm', 'aarch64', 'noarch', 'src'], 'str'],
    ['breed', 'rsync', 0, 'Breed', true, '', 'validate.REPO_BREEDS', 'str'],
    ['comment', '', 0, 'Comment', true, 'Free form text description', 0, 'str'],
    ['createrepo_flags', '<<inherit>>', 0, 'Createrepo Flags', true, 'Flags to use with createrepo', 0, 'dict'],
    ['environment', {}, 0, 'Environment Variables', true,
      'Use these environment variables during commands (key=value, space delimited)', 0, 'dict'],
    ['keep_updated', true, 0, 'Keep Updated', true, 'Update this repo on next \'cobbler reposync\'?', 0, 'bool'],
    ['mirror', 'None', 0, 'Mirror', true, 'Address of yum or rsync repo to mirror', 0, 'str'],
    ['mirror_type', 'baseurl', 0, 'Mirror Type', true, '', ['metalink', 'mirrorlist', 'baseurl'], 'str'],
    ['mirror_locally', true, 0, 'Mirror locally', true, 'Copy files or just reference the repo externally?', 0, 'bool'],
    ['name', '', 0, 'Name', true, 'Ex: f10-i386-updates', 0, 'str'],
    ['owners', 'SETTINGS:default_ownership', 0, 'Owners', true, 'Owners list for authz_ownership (space delimited)',
      [], 'list'],
    ['priority', 99, 0, 'Priority', true, 'Value for yum priorities plugin, if installed', 0, 'int'],
    ['proxy', '<<inherit>>', 0, 'Proxy information', true,
      'http://example.com:8080, or <<inherit>> to use proxy_url_ext from settings, blank or <<None>> for no proxy', [],
      'str'],
    ['rpm_list', [], 0, 'RPM List', true, 'Mirror just these RPMs (yum only)', 0, 'list'],
    ['yumopts', {}, 0, 'Yum Options', true, 'Options to write to yum config file', 0, 'dict'],
    ['rsyncopts', '', 0, 'Rsync Options', true, 'Options to use with rsync repo', 0, 'dict'],
  ];


  constructor() {
  }

  getAll(): any[] {
    return this.mockdata;
  }
}

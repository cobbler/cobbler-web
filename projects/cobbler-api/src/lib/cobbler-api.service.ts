import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  AngularXmlrpcService,
  MethodResponse,
  MethodFault,
  XmlRpcStruct,
  XmlRpcArray,
  XmlRpcTypes,
} from 'typescript-xmlrpc';
import { Settings } from './custom-types/settings';
import { COBBLER_URL } from './lib.config';
import {
  Distro,
  Image,
  Profile,
  Repo,
  System,
  Menu,
  NetworkInterface,
  Template,
} from './custom-types/items';
import {
  BackgroundAclSetupOptions,
  BackgroundBuildisoOptions,
  BackgroundImportOptions,
  BackgroundPowerSystem,
  BackgroundReplicateOptions,
  BackgroundReposyncOptions,
  Event,
  ExtendedVersion,
  InstallationStatus,
  PagesItemsResult,
  RegisterOptions,
  SyncOptions,
  SyncSystemsOptions,
  Version,
} from './custom-types/misc';
import { DistroSignatures } from './custom-types/signatures';
import {
  RestValue,
  XmlrpcHacksInput,
  AttributeValue,
  ResolvedValue,
  ModifyValue,
  TftpFileResult,
} from './custom-types/types';

// TODO: Investigate on server side to build and receive well known interfaces, not just plain objects.

@Injectable({
  providedIn: 'root',
})
export class CobblerApiService {
  private client: AngularXmlrpcService;

  constructor() {
    const xmlrpcService = inject(AngularXmlrpcService);
    const url = inject<URL>(COBBLER_URL);

    this.client = xmlrpcService;
    this.client.configureService(url);
  }

  reconfigureService(url: URL) {
    this.client.configureService(url);
  }

  check(token: string): Observable<Array<string>> {
    return this.client.methodCall('check', [token]).pipe(
      map<MethodResponse | MethodFault, Array<string>>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as Array<string>;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Check failed with code "' +
                data.faultCode +
                '" and error message "' +
                data.faultString +
                '"',
            );
          }
          throw new Error('Unexpected response type');
        },
      ),
    );
  }

  background_buildiso(
    options: BackgroundBuildisoOptions,
    token: string,
  ): Observable<string> {
    const transformedOptions: XmlRpcStruct = {
      members: [
        { name: 'iso', value: options.iso },
        { name: 'profiles', value: options.profiles },
        { name: 'systems', value: options.systems },
        { name: 'buildisodir', value: options.buildisodir },
        { name: 'distro', value: options.distro },
        { name: 'standalone', value: options.standalone },
        { name: 'airgapped', value: options.airgapped },
        { name: 'source', value: options.source },
        { name: 'excludeDNS', value: options.excludeDNS },
        { name: 'xorrisofsOpts', value: options.xorrisofsOpts },
      ],
    };
    return this.client
      .methodCall('background_buildiso', [transformedOptions, token])
      .pipe(
        map<MethodResponse | MethodFault, string>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as string;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Building the ISO in the background failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  background_aclsetup(
    options: BackgroundAclSetupOptions,
    token: string,
  ): Observable<string> {
    const transformedOptions: XmlRpcStruct = {
      members: [
        { name: 'adduser', value: options.adduser },
        { name: 'addgroup', value: options.addgroup },
        { name: 'removeuser', value: options.removeuser },
        { name: 'adduser', value: options.adduser },
      ],
    };
    return this.client
      .methodCall('background_aclsetup', [transformedOptions, token])
      .pipe(
        map<MethodResponse | MethodFault, string>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as string;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Applying the ACLs in the background failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  background_sync(options: SyncOptions, token: string): Observable<string> {
    const transformedOptions: XmlRpcStruct = {
      members: [
        { name: 'dhcp', value: options.dhcp },
        { name: 'dns', value: options.dns },
        { name: 'verbose', value: options.verbose },
      ],
    };
    return this.client
      .methodCall('background_sync', [transformedOptions, token])
      .pipe(
        map<MethodResponse | MethodFault, string>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as string;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Executing a sync in the background failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  background_syncsystems(
    options: SyncSystemsOptions,
    token: string,
  ): Observable<string> {
    const transformedOptions: XmlRpcStruct = {
      members: [
        { name: 'systems', value: { data: options.systems } },
        { name: 'verbose', value: options.verbose },
      ],
    };
    return this.client
      .methodCall('background_syncsystems', [transformedOptions, token])
      .pipe(
        map<MethodResponse | MethodFault, string>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as string;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Syncing the systems in background failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  background_hardlink(token: string): Observable<string> {
    const hardlinkOptions: XmlRpcStruct = { members: [] };
    return this.client
      .methodCall('background_hardlink', [hardlinkOptions, token])
      .pipe(
        map<MethodResponse | MethodFault, string>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as string;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Hardlinking files on the server in the background failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  backgroundMkloaders(token: string): Observable<string> {
    const mkloadersOptions: XmlRpcStruct = { members: [] };
    return this.client
      .methodCall('background_mkloaders', [mkloadersOptions, token])
      .pipe(
        map<MethodResponse | MethodFault, string>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as string;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Mkloading files on the server in the background failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  background_validate_autoinstall_files(token: string): Observable<string> {
    const validateAutoinstallOptions: XmlRpcStruct = { members: [] };
    return this.client
      .methodCall('background_validate_autoinstall_files', [
        validateAutoinstallOptions,
        token,
      ])
      .pipe(
        map<MethodResponse | MethodFault, string>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as string;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Validation of auto-installation files in the background failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  background_replicate(
    options: BackgroundReplicateOptions,
    token: string,
  ): Observable<string> {
    const transformedOptions: XmlRpcStruct = {
      members: [
        { name: 'master', value: options.master },
        { name: 'port', value: options.port },
        { name: 'distro_patterns', value: options.distro_patterns },
        { name: 'profile_patterns', value: options.profile_patterns },
        { name: 'system_patterns', value: options.system_patterns },
        { name: 'repo_patterns', value: options.repo_patterns },
        { name: 'image_patterns', value: options.image_patterns },
        { name: 'prune', value: options.prune },
        { name: 'omit_data', value: options.omit_data },
        { name: 'sync_all', value: options.sync_all },
        { name: 'use_ssl', value: options.use_ssl },
      ],
    };
    return this.client
      .methodCall('background_replicate', [transformedOptions, token])
      .pipe(
        map<MethodResponse | MethodFault, string>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as string;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Replicating the Cobbler instance in the background failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  background_import(
    options: BackgroundImportOptions,
    token: string,
  ): Observable<string> {
    const transformedOptions: XmlRpcStruct = {
      members: [
        { name: 'path', value: options.path },
        { name: 'name', value: options.name },
        { name: 'available_as', value: options.available_as },
        { name: 'autoinstall_file', value: options.autoinstall_file },
        { name: 'rsync_flags', value: options.rsync_flags },
        { name: 'arch', value: options.arch },
        { name: 'breed', value: options.breed },
        { name: 'os_version', value: options.os_version },
      ],
    };
    return this.client
      .methodCall('background_import', [transformedOptions, token])
      .pipe(
        map<MethodResponse | MethodFault, string>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as string;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Importing an ISO on the server in the background failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  background_reposync(
    options: BackgroundReposyncOptions,
    token: string,
  ): Observable<string> {
    const transformedOptions: XmlRpcStruct = {
      members: [
        { name: 'repos', value: { data: options.repos } },
        { name: 'only', value: options.only },
        { name: 'nofail', value: options.nofail },
        { name: 'tries', value: options.tries },
      ],
    };
    return this.client
      .methodCall('background_reposync', [transformedOptions, token])
      .pipe(
        map<MethodResponse | MethodFault, string>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as string;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Executing a reposync in the background failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  background_power_system(
    options: BackgroundPowerSystem,
    token: string,
  ): Observable<string> {
    const transformedOptions: XmlRpcStruct = {
      members: [
        { name: 'systems', value: { data: options.systems } },
        { name: 'power', value: options.power },
      ],
    };
    return this.client
      .methodCall('background_power_system', [transformedOptions, token])
      .pipe(
        map<MethodResponse | MethodFault, string>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as string;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Executing the power action for a system in the background failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  power_system(
    systemId: string,
    power: string,
    token: string,
  ): Observable<boolean> {
    return this.client
      .methodCall('power_system', [systemId, power, token])
      .pipe(
        map<MethodResponse | MethodFault, boolean>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as boolean;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Executing the power action for a system failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  background_signature_update(token: string): Observable<string> {
    const signatureUpdateOptions: XmlRpcStruct = { members: [] };
    return this.client
      .methodCall('background_signature_update', [
        signatureUpdateOptions,
        token,
      ])
      .pipe(
        map<MethodResponse | MethodFault, string>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as string;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Updating the signatures in the background failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  background_signature_reload(token: string): Observable<string> {
    const signatureReloadOptions: XmlRpcStruct = { members: [] };
    return this.client
      .methodCall('background_signature_reload', [
        signatureReloadOptions,
        token,
      ])
      .pipe(
        map<MethodResponse | MethodFault, string>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as string;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Reloading the signatures in the background failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  background_templates_refresh_content(token: string): Observable<string> {
    const templateRefreshContentOptions: XmlRpcStruct = { members: [] };
    return this.client
      .methodCall('background_templates_refresh_content', [
        templateRefreshContentOptions,
        token,
      ])
      .pipe(
        map<MethodResponse | MethodFault, string>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as string;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Refreshing the template contents in the background failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  templates_refresh_content(
    objects: Array<string>,
    token: string,
  ): Observable<boolean> {
    return this.client
      .methodCall('templates_refresh_content', [objects, token])
      .pipe(
        map<MethodResponse | MethodFault, boolean>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as boolean;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Refreshing the template contents failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  get_events(forUser: string): Observable<Array<Event>> {
    return this.client.methodCall('get_events', [forUser]).pipe(
      map<MethodResponse | MethodFault, Map<string, any>>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as Map<string, any>;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Getting the events failed with code "' +
                data.faultCode +
                '" and error message "' +
                data.faultString +
                '"',
            );
          }
          throw new Error('Unexpected response type');
        },
      ),
      map<Map<string, any>, Array<Event>>((data: Map<string, any>) => {
        let result: Array<Event> = [];
        data.forEach((value, key) => {
          const membersArray = value as Array<any>;
          const usersArray = membersArray[3] as Array<any>;
          result.push({
            id: key,
            statetime: membersArray[0] as number,
            name: membersArray[1] as string,
            state: membersArray[2] as string,
            readByWho: usersArray as string[],
          });
        });
        return result;
      }),
    );
  }

  get_event_log(eventId: string): Observable<string> {
    return this.client.methodCall('get_event_log', [eventId]).pipe(
      map<MethodResponse | MethodFault, string>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as string;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Getting the event log failed with code "' +
                data.faultCode +
                '" and error message "' +
                data.faultString +
                '"',
            );
          }
          throw new Error('Unexpected response type');
        },
      ),
    );
  }

  get_task_status(eventId: string): Observable<Event> {
    return this.client.methodCall('get_task_status', [eventId]).pipe(
      map<MethodResponse | MethodFault, Array<any>>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as Array<any>;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Getting the status of the requested task failed with code "' +
                data.faultCode +
                '" and error message "' +
                data.faultString +
                '"',
            );
          }
          throw new Error('Unexpected response type');
        },
      ),
      map<Array<any>, Event>((data: Array<any>) => {
        const readByWho = data[3] as Array<any>;
        return {
          id: eventId,
          statetime: data[0] as number,
          name: data[1] as string,
          state: data[2] as string,
          readByWho: readByWho as string[],
        };
      }),
    );
  }

  last_modified_time(): Observable<number> {
    return this.client.methodCall('last_modified_time').pipe(
      map<MethodResponse | MethodFault, number>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as number;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Getting the last modified time failed with code "' +
                data.faultCode +
                '" and error message "' +
                data.faultString +
                '"',
            );
          }
          throw new Error('Unexpected response type');
        },
      ),
    );
  }

  ping(): Observable<boolean> {
    return this.client.methodCall('ping').pipe(
      map<MethodResponse | MethodFault, boolean>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as boolean;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Pinging the server failed with code "' +
                data.faultCode +
                '" and error message "' +
                data.faultString +
                '"',
            );
          }
          throw new Error('Unexpected response type');
        },
      ),
    );
  }

  get_user_from_token(token: string): Observable<string> {
    return this.client.methodCall('get_user_from_token', [token]).pipe(
      map<MethodResponse | MethodFault, string>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as string;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Getting the user from the requested token failed with code "' +
                data.faultCode +
                '" and error message "' +
                data.faultString +
                '"',
            );
          }
          throw new Error('Unexpected response type');
        },
      ),
    );
  }

  private rebuildItem(xmlrpcStruct: Map<string, any>): object {
    const result = {};
    xmlrpcStruct.forEach((value, key) => {
      if (key === 'ks_meta' || key === 'kickstart') {
        // Skip legacy keys
        return;
      }
      if (AngularXmlrpcService.instanceOfXmlRpcArray(value)) {
        result[key] = this.convertXmlRpcArrayToTypeScriptArray(value);
      } else if (AngularXmlrpcService.instanceOfXmlRpcStruct(value)) {
        result[key] = this.convertXmlRpcStructToTypeScriptObject(value);
      } else if (value === '&lt;&lt;inherit&gt;&gt;') {
        // FIXME: Maybe we need to XML encode this as other strings potentially also could need encoding
        result[key] = '<<inherit>>';
      } else {
        result[key] = value;
      }
    });
    return result;
  }

  // TODO: Create casting magic to output the right item type
  get_item(
    what: string,
    name: string,
    flatten: boolean = false,
  ): Observable<object> {
    return this.client.methodCall('get_item', [what, name, flatten]).pipe(
      map<MethodResponse | MethodFault, object>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as object;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Getting the requested item failed with code "' +
                data.faultCode +
                '" and error message "' +
                data.faultString +
                '"',
            );
          }
          throw new Error('Unexpected response type');
        },
      ),
    );
  }

  get_distro(
    name: string,
    flatten: boolean = false,
    resolved: boolean = false,
    token: string,
  ): Observable<Distro> {
    return this.client
      .methodCall('get_distro', [name, flatten, resolved, token])
      .pipe(
        map<MethodResponse | MethodFault, Distro>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              if (!(data.value instanceof Map)) {
                throw new Error('Expected Map not something else!');
              }
              const result = this.rebuildItem(data.value);
              return result as Distro;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Getting the requested distro failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  get_profile(
    name: string,
    flatten: boolean = false,
    resolved: boolean = false,
    token: string,
  ): Observable<Profile> {
    return this.client
      .methodCall('get_profile', [name, flatten, resolved, token])
      .pipe(
        map<MethodResponse | MethodFault, Profile>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              if (data.value instanceof Map) {
                const result = this.rebuildItem(data.value);
                return result as Profile;
              }
              throw new Error('Expected Map not something else!');
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Getting the requested profile failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  get_system(
    name: string,
    flatten: boolean = false,
    resolved: boolean = false,
    token: string,
  ): Observable<System> {
    return this.client
      .methodCall('get_system', [name, flatten, resolved, token])
      .pipe(
        map<MethodResponse | MethodFault, System>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              if (!(data.value instanceof Map)) {
                throw new Error('Expected Map not something else!');
              }
              const result = this.rebuildItem(data.value);
              return result as System;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Getting the requested system failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  get_repo(
    name: string,
    flatten: boolean = false,
    resolved: boolean = false,
    token: string,
  ): Observable<Repo> {
    return this.client
      .methodCall('get_repo', [name, flatten, resolved, token])
      .pipe(
        map<MethodResponse | MethodFault, Repo>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              if (!(data.value instanceof Map)) {
                throw new Error('Expected Map not something else!');
              }
              const result = this.rebuildItem(data.value);
              return result as Repo;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Getting the requested repository failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  get_image(
    name: string,
    flatten: boolean = false,
    resolved: boolean = false,
    token: string,
  ): Observable<Image> {
    return this.client
      .methodCall('get_image', [name, flatten, resolved, token])
      .pipe(
        map<MethodResponse | MethodFault, Image>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              if (!(data.value instanceof Map)) {
                throw new Error('Expected Map not something else!');
              }
              const result = this.rebuildItem(data.value);
              return result as Image;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Getting the requested image failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  get_menu(
    name: string,
    flatten: boolean = false,
    resolved: boolean = false,
    token: string,
  ): Observable<Menu> {
    return this.client
      .methodCall('get_menu', [name, flatten, resolved, token])
      .pipe(
        map<MethodResponse | MethodFault, Menu>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              if (!(data.value instanceof Map)) {
                throw new Error('Expected Map not something else!');
              }
              const result = this.rebuildItem(data.value);
              return result as Menu;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Getting the requested menu failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  get_network_interface(
    name: string,
    flatten = false,
    resolved = false,
    token: string,
  ): Observable<NetworkInterface> {
    return this.client
      .methodCall('get_network_interface', [name, flatten, resolved, token])
      .pipe(
        map<MethodResponse | MethodFault, NetworkInterface>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              if (!(data.value instanceof Map)) {
                throw new Error('Expected Map not something else!');
              }
              const result = this.rebuildItem(data.value);
              return result as NetworkInterface;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Getting the requested network interface failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  get_items(what: string): Observable<Array<object>> {
    // TODO: Add magic for casting to correct Collection
    return this.client.methodCall('get_items', [what]).pipe(
      map<MethodResponse | MethodFault, Array<object>>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            // FIXME: Make the cast without the unknown possible
            return data.value as unknown as Array<object>;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Getting the requested collection failed with code "' +
                data.faultCode +
                '" and error message "' +
                data.faultString +
                '"',
            );
          }
          throw new Error('Unexpected response type');
        },
      ),
    );
  }

  get_item_names(what: string): Observable<Array<string>> {
    return this.client.methodCall('get_item_names', [what]).pipe(
      map<MethodResponse | MethodFault, Array<string>>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            if (!(data.value instanceof Array)) {
              throw new Error('Expected Array but got something else!');
            }
            return data.value as Array<string>;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Getting the item names failed with code "' +
                data.faultCode +
                '" and error message "' +
                data.faultString +
                '"',
            );
          }
          throw new Error('Unexpected response type');
        },
      ),
    );
  }

  get_item_resolved_value(
    itemUuid: string,
    attribute: Array<string>,
  ): Observable<ResolvedValue> {
    return this.client
      .methodCall('get_item_resolved_value', [itemUuid, attribute])
      .pipe(
        map<MethodResponse | MethodFault, ResolvedValue>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as ResolvedValue;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Getting the resolved item value failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  get_distros(): Observable<Array<Distro>> {
    return this.client.methodCall('get_distros').pipe(
      map<MethodResponse | MethodFault, Array<Distro>>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            if (!(data.value instanceof Array)) {
              throw new Error('Expected Array but got something else!');
            }
            const result = [];
            data.value.forEach((value) => {
              if (!(value instanceof Map)) {
                throw new Error('Expected Map not something else!');
              }
              result.push(this.rebuildItem(value));
            });
            return result as Array<Distro>;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Getting all distros failed with code "' +
                data.faultCode +
                '" and error message "' +
                data.faultString +
                '"',
            );
          }
          throw new Error('Unexpected response type');
        },
      ),
    );
  }

  get_profiles(): Observable<Array<Profile>> {
    return this.client.methodCall('get_profiles').pipe(
      map<MethodResponse | MethodFault, Array<Profile>>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            if (!(data.value instanceof Array)) {
              throw new Error('Expected Array but got something else!');
            }
            const result = [];
            data.value.forEach((value) => {
              if (!(value instanceof Map)) {
                throw new Error('Expected Map not something else!');
              }
              result.push(this.rebuildItem(value));
            });
            return result as Array<Profile>;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Getting all profiles failed with code "' +
                data.faultCode +
                '" and error message "' +
                data.faultString +
                '"',
            );
          }
          throw new Error('Unexpected response type');
        },
      ),
    );
  }

  get_systems(): Observable<Array<System>> {
    return this.client.methodCall('get_systems').pipe(
      map<MethodResponse | MethodFault, Array<System>>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            if (!(data.value instanceof Array)) {
              throw new Error('Expected Array but got something else!');
            }
            const result = [];
            data.value.forEach((value) => {
              if (!(value instanceof Map)) {
                throw new Error('Expected Map not something else!');
              }
              result.push(this.rebuildItem(value));
            });
            return result as Array<System>;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Getting the systems failed with code "' +
                data.faultCode +
                '" and error message "' +
                data.faultString +
                '"',
            );
          }
          throw new Error('Unexpected response type');
        },
      ),
    );
  }

  get_repos(): Observable<Array<Repo>> {
    return this.client.methodCall('get_repos').pipe(
      map<MethodResponse | MethodFault, Array<Repo>>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            if (!(data.value instanceof Array)) {
              throw new Error('Expected Array but got something else!');
            }
            const result = [];
            data.value.forEach((value) => {
              if (!(value instanceof Map)) {
                throw new Error('Expected Map not something else!');
              }
              result.push(this.rebuildItem(value));
            });
            return result as Array<Repo>;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Getting the repositories failed with code "' +
                data.faultCode +
                '" and error message "' +
                data.faultString +
                '"',
            );
          }
          throw new Error('Unexpected response type');
        },
      ),
    );
  }

  get_images(): Observable<Array<Image>> {
    return this.client.methodCall('get_images').pipe(
      map<MethodResponse | MethodFault, Array<Image>>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            if (!(data.value instanceof Array)) {
              throw new Error('Expected Array but got something else!');
            }
            const result = [];
            data.value.forEach((value) => {
              if (!(value instanceof Map)) {
                throw new Error('Expected Map not something else!');
              }
              result.push(this.rebuildItem(value));
            });
            return result as Array<Image>;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Getting the images failed with code "' +
                data.faultCode +
                '" and error message "' +
                data.faultString +
                '"',
            );
          }
          throw new Error('Unexpected response type');
        },
      ),
    );
  }

  get_menus(): Observable<Array<Menu>> {
    return this.client.methodCall('get_menus').pipe(
      map<MethodResponse | MethodFault, Array<Menu>>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            if (!(data.value instanceof Array)) {
              throw new Error('Expected Array but got something else!');
            }
            const result = [];
            data.value.forEach((value) => {
              if (!(value instanceof Map)) {
                throw new Error('Expected Map not something else!');
              }
              result.push(this.rebuildItem(value));
            });
            return result as Array<Menu>;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Getting the files failed with code "' +
                data.faultCode +
                '" and error message "' +
                data.faultString +
                '"',
            );
          }
          throw new Error('Unexpected response type');
        },
      ),
    );
  }

  get_network_interfaces(): Observable<Array<NetworkInterface>> {
    return this.client.methodCall('get_network_interfaces').pipe(
      map<MethodResponse | MethodFault, Array<NetworkInterface>>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            if (!(data.value instanceof Array)) {
              throw new Error('Expected Array but got something else!');
            }
            const result = [];
            data.value.forEach((value) => {
              if (!(value instanceof Map)) {
                throw new Error('Expected Map not something else!');
              }
              result.push(this.rebuildItem(value));
            });
            return result as Array<NetworkInterface>;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Getting the network interfaces failed with code "' +
                data.faultCode +
                '" and error message "' +
                data.faultString +
                '"',
            );
          }
          throw new Error('Unexpected response type');
        },
      ),
    );
  }

  get_templates(): Observable<Array<Template>> {
    return this.client.methodCall('get_templates').pipe(
      map<MethodResponse | MethodFault, Array<Template>>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            if (!(data.value instanceof Array)) {
              throw new Error('Expected Array but got something else!');
            }
            const result = [];
            data.value.forEach((value) => {
              if (!(value instanceof Map)) {
                throw new Error('Expected Map not something else!');
              }
              result.push(this.rebuildItem(value));
            });
            return result as Array<Template>;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Getting the requested templates failed with code "' +
                data.faultCode +
                '" and error message "' +
                data.faultString +
                '"',
            );
          }
          throw new Error('Unexpected response type');
        },
      ),
    );
  }

  get_template(
    name: string,
    flatten: boolean = false,
    resolved: boolean = false,
    token: string,
  ): Observable<Template> {
    return this.client
      .methodCall('get_template', [name, flatten, resolved, token])
      .pipe(
        map<MethodResponse | MethodFault, Template>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              if (!(data.value instanceof Map)) {
                throw new Error('Expected Map not something else!');
              }
              const result = this.rebuildItem(data.value);
              return result as Template;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Getting the requested template failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  find_items(
    what: string,
    criteria: object,
    sortField: string,
    expand = false,
    resolved = false,
    token: string,
  ): Observable<Array<any>> {
    return this.client
      .methodCall('find_items', [
        what,
        criteria as XmlRpcStruct,
        sortField,
        expand,
        resolved,
        token,
      ])
      .pipe(
        map<MethodResponse | MethodFault, Array<any>>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              // FIXME: Make the cast without the unknown possible
              return data.value as unknown as Array<any>;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Finding the requested items failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  find_distro(
    criteria: object,
    expand = false,
    resolved = false,
    token: string,
  ): Observable<Array<Distro>> {
    return this.client
      .methodCall('find_distro', [
        criteria as XmlRpcStruct,
        expand,
        resolved,
        token,
      ])
      .pipe(
        map<MethodResponse | MethodFault, Array<Distro>>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              // FIXME: Make the cast without the unknown possible
              return data.value as unknown as Array<Distro>;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Finding the requested distros failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  find_profile(
    criteria: object,
    expand = false,
    resolved = false,
    token: string,
  ): Observable<Array<Profile>> {
    return this.client
      .methodCall('find_profile', [
        criteria as XmlRpcStruct,
        expand,
        resolved,
        token,
      ])
      .pipe(
        map<MethodResponse | MethodFault, Array<Profile>>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              // FIXME: Make the cast without the unknown possible
              return data.value as unknown as Array<Profile>;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Finding the requested profiles failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  find_system(
    criteria: object,
    expand = false,
    resolved = false,
    token: string,
  ): Observable<Array<System>> {
    return this.client
      .methodCall('find_system', [
        criteria as XmlRpcStruct,
        expand,
        resolved,
        token,
      ])
      .pipe(
        map<MethodResponse | MethodFault, Array<System>>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              // FIXME: Make the cast without the unknown possible
              return data.value as unknown as Array<System>;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Finding the requested systems failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  find_repo(
    criteria: object,
    expand = false,
    resolved = false,
    token: string,
  ): Observable<Array<Repo>> {
    return this.client
      .methodCall('find_repo', [
        criteria as XmlRpcStruct,
        expand,
        resolved,
        token,
      ])
      .pipe(
        map<MethodResponse | MethodFault, Array<Repo>>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              // FIXME: Make the cast without the unknown possible
              return data.value as unknown as Array<Repo>;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Finding the requested repos failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  find_image(
    criteria: object,
    expand = false,
    resolved = false,
    token: string,
  ): Observable<Array<Image>> {
    return this.client
      .methodCall('find_image', [
        criteria as XmlRpcStruct,
        expand,
        resolved,
        token,
      ])
      .pipe(
        map<MethodResponse | MethodFault, Array<Image>>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              // FIXME: Make the cast without the unknown possible
              return data.value as unknown as Array<Image>;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Finding the requested images failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  find_menu(
    criteria: object,
    expand = false,
    resolved = false,
    token: string,
  ): Observable<Array<Menu>> {
    return this.client
      .methodCall('find_menu', [
        criteria as XmlRpcStruct,
        expand,
        resolved,
        token,
      ])
      .pipe(
        map<MethodResponse | MethodFault, Array<Menu>>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              // FIXME: Make the cast without the unknown possible
              return data.value as unknown as Array<Menu>;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Finding the requested files failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  find_template(
    criteria: object,
    expand = false,
    resolved = false,
    token: string,
  ): Observable<Array<any>> {
    return this.client
      .methodCall('find_template', [
        criteria as XmlRpcStruct,
        expand,
        resolved,
        token,
      ])
      .pipe(
        map<MethodResponse | MethodFault, Array<any>>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as Array<any>;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Finding the requested template failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  find_network_interface(
    criteria: object,
    expand = false,
    resolved = false,
    token: string,
  ): Observable<Array<NetworkInterface>> {
    return this.client
      .methodCall('find_network_interface', [
        criteria as XmlRpcStruct,
        expand,
        resolved,
        token,
      ])
      .pipe(
        map<MethodResponse | MethodFault, Array<NetworkInterface>>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as unknown as Array<NetworkInterface>;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Finding the requested network interface failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  find_items_paged(
    what: string,
    criteria: object,
    sortFields: string,
    page: number,
    itemsPerPage: number,
    token: string,
  ): Observable<PagesItemsResult> {
    return this.client
      .methodCall('find_items_paged', [
        what,
        criteria as XmlRpcStruct,
        sortFields,
        page,
        itemsPerPage,
        token,
      ])
      .pipe(
        map<MethodResponse | MethodFault, PagesItemsResult>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              // FIXME: Make the cast without the unknown possible
              return data.value as unknown as PagesItemsResult;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Finding the requested items (paged) failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  has_item(what: string, name: string, token: string): Observable<boolean> {
    return this.client.methodCall('has_item', [what, name, token]).pipe(
      map<MethodResponse | MethodFault, boolean>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as boolean;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Checking if the item exists failed with code "' +
                data.faultCode +
                '" and error message "' +
                data.faultString +
                '"',
            );
          }
          throw new Error('Unexpected response type');
        },
      ),
    );
  }

  get_item_handle(
    what: string,
    name: string,
    token: string,
  ): Observable<string> {
    return this.client.methodCall('get_item_handle', [what, name, token]).pipe(
      map<MethodResponse | MethodFault, string>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as string;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Getting the item handle failed with code "' +
                data.faultCode +
                '" and error message "' +
                data.faultString +
                '"',
            );
          }
          throw new Error('Unexpected response type');
        },
      ),
    );
  }

  get_distro_handle(name: string): Observable<string> {
    return this.client.methodCall('get_distro_handle', [name]).pipe(
      map<MethodResponse | MethodFault, string>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as string;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Getting the distro handle failed with code "' +
                data.faultCode +
                '" and error message "' +
                data.faultString +
                '"',
            );
          }
          throw new Error('Unexpected response type');
        },
      ),
    );
  }

  get_profile_handle(name: string): Observable<string> {
    return this.client.methodCall('get_profile_handle', [name]).pipe(
      map<MethodResponse | MethodFault, string>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as string;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Getting the profile handle failed with code "' +
                data.faultCode +
                '" and error message "' +
                data.faultString +
                '"',
            );
          }
          throw new Error('Unexpected response type');
        },
      ),
    );
  }

  get_system_handle(name: string): Observable<string> {
    return this.client.methodCall('get_system_handle', [name]).pipe(
      map<MethodResponse | MethodFault, string>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as string;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Getting the system handle failed with code "' +
                data.faultCode +
                '" and error message "' +
                data.faultString +
                '"',
            );
          }
          throw new Error('Unexpected response type');
        },
      ),
    );
  }

  get_repo_handle(name: string): Observable<string> {
    return this.client.methodCall('get_repo_handle', [name]).pipe(
      map<MethodResponse | MethodFault, string>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as string;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Getting the repository handle failed with code "' +
                data.faultCode +
                '" and error message "' +
                data.faultString +
                '"',
            );
          }
          throw new Error('Unexpected response type');
        },
      ),
    );
  }

  get_image_handle(name: string): Observable<string> {
    return this.client.methodCall('get_image_handle', [name]).pipe(
      map<MethodResponse | MethodFault, string>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as string;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Getting the image handle failed with code "' +
                data.faultCode +
                '" and error message "' +
                data.faultString +
                '"',
            );
          }
          throw new Error('Unexpected response type');
        },
      ),
    );
  }

  get_menu_handle(name: string): Observable<string> {
    return this.client.methodCall('get_menu_handle', [name]).pipe(
      map<MethodResponse | MethodFault, string>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as string;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Getting the file handle failed with code "' +
                data.faultCode +
                '" and error message "' +
                data.faultString +
                '"',
            );
          }
          throw new Error('Unexpected response type');
        },
      ),
    );
  }

  get_network_interface_handle(name: string): Observable<string> {
    return this.client.methodCall('get_network_interface_handle', [name]).pipe(
      map<MethodResponse | MethodFault, string>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as string;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Getting the network interface handle failed with code "' +
                data.faultCode +
                '" and error message "' +
                data.faultString,
            );
          }
          throw new Error('Unexpected response type');
        },
      ),
    );
  }

  get_template_handle(name: string): Observable<string> {
    return this.client.methodCall('get_template_handle', [name]).pipe(
      map<MethodResponse | MethodFault, string>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as string;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Getting the template handle failed with code "' +
                data.faultCode +
                '" and error message "' +
                data.faultString,
            );
          }
          throw new Error('Unexpected response type');
        },
      ),
    );
  }

  get_distro_group_handle(name: string): Observable<string> {
    return this.client.methodCall('get_distro_group_handle', [name]).pipe(
      map<MethodResponse | MethodFault, string>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as string;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Getting the distro group handle failed with code "' +
                data.faultCode +
                '" and error message "' +
                data.faultString +
                '"',
            );
          }
          throw new Error('Unexpected response type');
        },
      ),
    );
  }

  get_profile_group_handle(name: string): Observable<string> {
    return this.client.methodCall('get_profile_group_handle', [name]).pipe(
      map<MethodResponse | MethodFault, string>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as string;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Getting the profile group handle failed with code "' +
                data.faultCode +
                '" and error message "' +
                data.faultString +
                '"',
            );
          }
          throw new Error('Unexpected response type');
        },
      ),
    );
  }

  get_system_group_handle(name: string): Observable<string> {
    return this.client.methodCall('get_system_group_handle', [name]).pipe(
      map<MethodResponse | MethodFault, string>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as string;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Getting the system group handle failed with code "' +
                data.faultCode +
                '" and error message "' +
                data.faultString +
                '"',
            );
          }
          throw new Error('Unexpected response type');
        },
      ),
    );
  }

  remove_item(
    what: string,
    name: string,
    token: string,
    recursive = true,
  ): Observable<boolean> {
    return this.client
      .methodCall('remove_item', [what, name, token, recursive])
      .pipe(
        map<MethodResponse | MethodFault, boolean>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as boolean;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Removing the requested item failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  remove_distro(
    name: string,
    token: string,
    recursive = true,
  ): Observable<boolean> {
    return this.client
      .methodCall('remove_distro', [name, token, recursive])
      .pipe(
        map<MethodResponse | MethodFault, boolean>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as boolean;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Removing the requested distro failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  remove_profile(
    name: string,
    token: string,
    recursive = true,
  ): Observable<boolean> {
    return this.client
      .methodCall('remove_profile', [name, token, recursive])
      .pipe(
        map<MethodResponse | MethodFault, boolean>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as boolean;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Removing the requested profile failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  remove_system(
    name: string,
    token: string,
    recursive = true,
  ): Observable<boolean> {
    return this.client
      .methodCall('remove_system', [name, token, recursive])
      .pipe(
        map<MethodResponse | MethodFault, boolean>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as boolean;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Removing the requested system failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  remove_repo(
    name: string,
    token: string,
    recursive = true,
  ): Observable<boolean> {
    return this.client.methodCall('remove_repo', [name, token, recursive]).pipe(
      map<MethodResponse | MethodFault, boolean>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as boolean;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Removing the requested repo failed with code "' +
                data.faultCode +
                '" and error message "' +
                data.faultString +
                '"',
            );
          }
          throw new Error('Unexpected response type');
        },
      ),
    );
  }

  remove_image(
    name: string,
    token: string,
    recursive = true,
  ): Observable<boolean> {
    return this.client
      .methodCall('remove_image', [name, token, recursive])
      .pipe(
        map<MethodResponse | MethodFault, boolean>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as boolean;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Removing the requested image failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  remove_menu(
    name: string,
    token: string,
    recursive = true,
  ): Observable<boolean> {
    return this.client.methodCall('remove_menu', [name, token, recursive]).pipe(
      map<MethodResponse | MethodFault, boolean>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as boolean;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Removing the requested file failed with code "' +
                data.faultCode +
                '" and error message "' +
                data.faultString +
                '"',
            );
          }
          throw new Error('Unexpected response type');
        },
      ),
    );
  }

  remove_template(
    name: string,
    token: string,
    recursive = true,
  ): Observable<boolean> {
    return this.client
      .methodCall('remove_template', [name, token, recursive])
      .pipe(
        map<MethodResponse | MethodFault, boolean>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as boolean;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Removing the requested template failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  remove_network_interface(
    name: string,
    token: string,
    recursive = true,
  ): Observable<boolean> {
    return this.client
      .methodCall('remove_network_interface', [name, token, recursive])
      .pipe(
        map<MethodResponse | MethodFault, boolean>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as boolean;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Removing the requested network interface failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  remove_distro_group(
    name: string,
    token: string,
    recursive = true,
  ): Observable<boolean> {
    return this.client
      .methodCall('remove_distro_group', [name, token, recursive])
      .pipe(
        map<MethodResponse | MethodFault, boolean>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as boolean;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Removing the requested distro group failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  remove_profile_group(
    name: string,
    token: string,
    recursive = true,
  ): Observable<boolean> {
    return this.client
      .methodCall('remove_profile_group', [name, token, recursive])
      .pipe(
        map<MethodResponse | MethodFault, boolean>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as boolean;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Removing the requested profile group failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  remove_system_group(
    name: string,
    token: string,
    recursive = true,
  ): Observable<boolean> {
    return this.client
      .methodCall('remove_system_group', [name, token, recursive])
      .pipe(
        map<MethodResponse | MethodFault, boolean>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as boolean;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Removing the requested system group failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  copy_item(
    what: string,
    objectId: string,
    newName: string,
    token: string,
  ): Observable<boolean> {
    return this.client
      .methodCall('copy_item', [what, objectId, newName, token])
      .pipe(
        map<MethodResponse | MethodFault, boolean>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as boolean;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Copying the requested item failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  copy_distro(
    objectId: string,
    newName: string,
    token: string,
  ): Observable<boolean> {
    return this.client
      .methodCall('copy_distro', [objectId, newName, token])
      .pipe(
        map<MethodResponse | MethodFault, boolean>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as boolean;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Copying the requested distro failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  copy_profile(
    objectId: string,
    newName: string,
    token: string,
  ): Observable<boolean> {
    return this.client
      .methodCall('copy_profile', [objectId, newName, token])
      .pipe(
        map<MethodResponse | MethodFault, boolean>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as boolean;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Copying the requested profile failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  copy_system(
    objectId: string,
    newName: string,
    token: string,
  ): Observable<boolean> {
    return this.client
      .methodCall('copy_system', [objectId, newName, token])
      .pipe(
        map<MethodResponse | MethodFault, boolean>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as boolean;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Copying the requested system failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  copy_repo(
    objectId: string,
    newName: string,
    token: string,
  ): Observable<boolean> {
    return this.client.methodCall('copy_repo', [objectId, newName, token]).pipe(
      map<MethodResponse | MethodFault, boolean>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as boolean;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Copying the requested repository failed with code "' +
                data.faultCode +
                '" and error message "' +
                data.faultString +
                '"',
            );
          }
          throw new Error('Unexpected response type');
        },
      ),
    );
  }

  copy_image(
    objectId: string,
    newName: string,
    token: string,
  ): Observable<boolean> {
    return this.client
      .methodCall('copy_image', [objectId, newName, token])
      .pipe(
        map<MethodResponse | MethodFault, boolean>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as boolean;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Copying the requested image failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  copy_menu(
    objectId: string,
    newName: string,
    token: string,
  ): Observable<boolean> {
    return this.client.methodCall('copy_menu', [objectId, newName, token]).pipe(
      map<MethodResponse | MethodFault, boolean>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as boolean;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Copying the requested file failed with code "' +
                data.faultCode +
                '" and error message "' +
                data.faultString +
                '"',
            );
          }
          throw new Error('Unexpected response type');
        },
      ),
    );
  }

  copy_network_interface(
    objectId: string,
    newName: string,
    token: string,
  ): Observable<boolean> {
    return this.client
      .methodCall('copy_network_interface', [objectId, newName, token])
      .pipe(
        map<MethodResponse | MethodFault, boolean>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as boolean;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Copying the requested network interface failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  copy_template(
    objectId: string,
    newName: string,
    token: string,
  ): Observable<boolean> {
    return this.client
      .methodCall('copy_template', [objectId, newName, token])
      .pipe(
        map<MethodResponse | MethodFault, boolean>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as boolean;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Copying the requested template failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  copy_distro_group(
    objectId: string,
    newName: string,
    token: string,
  ): Observable<boolean> {
    return this.client
      .methodCall('copy_distro_group', [objectId, newName, token])
      .pipe(
        map<MethodResponse | MethodFault, boolean>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as boolean;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Copying the requested distro group failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  copy_profile_group(
    objectId: string,
    newName: string,
    token: string,
  ): Observable<boolean> {
    return this.client
      .methodCall('copy_profile_group', [objectId, newName, token])
      .pipe(
        map<MethodResponse | MethodFault, boolean>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as boolean;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Copying the requested profile group failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  copy_system_group(
    objectId: string,
    newName: string,
    token: string,
  ): Observable<boolean> {
    return this.client
      .methodCall('copy_system_group', [objectId, newName, token])
      .pipe(
        map<MethodResponse | MethodFault, boolean>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as boolean;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Copying the requested system group failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  rename_item(
    what: string,
    objectId: string,
    newName: string,
    token: string,
  ): Observable<boolean> {
    return this.client
      .methodCall('rename_item', [what, objectId, newName, token])
      .pipe(
        map<MethodResponse | MethodFault, boolean>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as boolean;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Renaming the requested item failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  rename_distro(
    objectId: string,
    newName: string,
    token: string,
  ): Observable<boolean> {
    return this.client
      .methodCall('rename_distro', [objectId, newName, token])
      .pipe(
        map<MethodResponse | MethodFault, boolean>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as boolean;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Renaming the requested distro failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  rename_profile(
    objectId: string,
    newName: string,
    token: string,
  ): Observable<boolean> {
    return this.client
      .methodCall('rename_profile', [objectId, newName, token])
      .pipe(
        map<MethodResponse | MethodFault, boolean>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as boolean;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Renaming the requested profile failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  rename_system(
    objectId: string,
    newName: string,
    token: string,
  ): Observable<boolean> {
    return this.client
      .methodCall('rename_system', [objectId, newName, token])
      .pipe(
        map<MethodResponse | MethodFault, boolean>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as boolean;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Renaming the requested system failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  rename_repo(
    objectId: string,
    newName: string,
    token: string,
  ): Observable<boolean> {
    return this.client
      .methodCall('rename_repo', [objectId, newName, token])
      .pipe(
        map<MethodResponse | MethodFault, boolean>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as boolean;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Renaming the requested repository failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  rename_image(
    objectId: string,
    newName: string,
    token: string,
  ): Observable<boolean> {
    return this.client
      .methodCall('rename_image', [objectId, newName, token])
      .pipe(
        map<MethodResponse | MethodFault, boolean>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as boolean;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Renaming the requested image failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  rename_menu(
    objectId: string,
    newName: string,
    token: string,
  ): Observable<boolean> {
    return this.client
      .methodCall('rename_menu', [objectId, newName, token])
      .pipe(
        map<MethodResponse | MethodFault, boolean>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as boolean;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Renaming the requested menu failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  rename_network_interface(
    objectId: string,
    newName: string,
    token: string,
  ): Observable<boolean> {
    return this.client
      .methodCall('rename_network_interface', [objectId, newName, token])
      .pipe(
        map<MethodResponse | MethodFault, boolean>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as boolean;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Renaming the requested network interface failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  rename_template(
    objectId: string,
    newName: string,
    token: string,
  ): Observable<boolean> {
    return this.client
      .methodCall('rename_template', [objectId, newName, token])
      .pipe(
        map<MethodResponse | MethodFault, boolean>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as boolean;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Renaming the requested template failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  rename_distro_group(
    objectId: string,
    newName: string,
    token: string,
  ): Observable<boolean> {
    return this.client
      .methodCall('rename_distro_group', [objectId, newName, token])
      .pipe(
        map<MethodResponse | MethodFault, boolean>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as boolean;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Renaming the requested distro group failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  rename_profile_group(
    objectId: string,
    newName: string,
    token: string,
  ): Observable<boolean> {
    return this.client
      .methodCall('rename_profile_group', [objectId, newName, token])
      .pipe(
        map<MethodResponse | MethodFault, boolean>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as boolean;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Renaming the requested profile group failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  rename_system_group(
    objectId: string,
    newName: string,
    token: string,
  ): Observable<boolean> {
    return this.client
      .methodCall('rename_system_group', [objectId, newName, token])
      .pipe(
        map<MethodResponse | MethodFault, boolean>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as boolean;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Renaming the requested system group failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  new_item(
    what: string,
    token: string,
    isSubobject = false,
    rest?: RestValue,
  ): Observable<string> {
    return this.client.methodCall('new_item', [what, token, isSubobject]).pipe(
      map<MethodResponse | MethodFault, string>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as string;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Creating a new item failed with code "' +
                data.faultCode +
                '" and error message "' +
                data.faultString +
                '"',
            );
          }
          throw new Error('Unexpected response type');
        },
      ),
    );
  }

  new_distro(token: string): Observable<string> {
    return this.client.methodCall('new_distro', [token]).pipe(
      map<MethodResponse | MethodFault, string>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as string;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Creating a new distro failed with code "' +
                data.faultCode +
                '" and error message "' +
                data.faultString +
                '"',
            );
          }
          throw new Error('Unexpected response type');
        },
      ),
    );
  }

  new_profile(token: string): Observable<string> {
    return this.client.methodCall('new_profile', [token]).pipe(
      map<MethodResponse | MethodFault, string>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as string;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Creating a new profile failed with code "' +
                data.faultCode +
                '" and error message "' +
                data.faultString +
                '"',
            );
          }
          throw new Error('Unexpected response type');
        },
      ),
    );
  }

  new_subprofile(token: string): Observable<string> {
    return this.client.methodCall('new_subprofile', [token]).pipe(
      map<MethodResponse | MethodFault, string>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as string;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Creating a new subprofile failed with code "' +
                data.faultCode +
                '" and error message "' +
                data.faultString +
                '"',
            );
          }
          throw new Error('Unexpected response type');
        },
      ),
    );
  }

  new_system(token: string): Observable<string> {
    return this.client.methodCall('new_system', [token]).pipe(
      map<MethodResponse | MethodFault, string>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as string;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Creating a new system failed with code "' +
                data.faultCode +
                '" and error message "' +
                data.faultString +
                '"',
            );
          }
          throw new Error('Unexpected response type');
        },
      ),
    );
  }

  new_repo(token: string): Observable<string> {
    return this.client.methodCall('new_repo', [token]).pipe(
      map<MethodResponse | MethodFault, string>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as string;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Creating a new repository failed with code "' +
                data.faultCode +
                '" and error message "' +
                data.faultString +
                '"',
            );
          }
          throw new Error('Unexpected response type');
        },
      ),
    );
  }

  new_image(token: string): Observable<string> {
    return this.client.methodCall('new_image', [token]).pipe(
      map<MethodResponse | MethodFault, string>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as string;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Creating a new image failed with code "' +
                data.faultCode +
                '" and error message "' +
                data.faultString +
                '"',
            );
          }
          throw new Error('Unexpected response type');
        },
      ),
    );
  }

  new_menu(token: string): Observable<string> {
    return this.client.methodCall('new_menu', [token]).pipe(
      map<MethodResponse | MethodFault, string>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as string;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Creating a new menu failed with code "' +
                data.faultCode +
                '" and error message "' +
                data.faultString +
                '"',
            );
          }
          throw new Error('Unexpected response type');
        },
      ),
    );
  }

  new_network_interface(systemUid: string, token: string): Observable<string> {
    return this.client
      .methodCall('new_network_interface', [systemUid, token])
      .pipe(
        map<MethodResponse | MethodFault, string>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as string;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Creating a new network interface failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  new_template(token: string): Observable<string> {
    return this.client.methodCall('new_template', [token]).pipe(
      map<MethodResponse | MethodFault, string>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as string;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Creating a new template failed with code "' +
                data.faultCode +
                '" and error message "' +
                data.faultString +
                '"',
            );
          }
          throw new Error('Unexpected response type');
        },
      ),
    );
  }

  new_distro_group(token: string): Observable<string> {
    return this.client.methodCall('new_distro_group', [token]).pipe(
      map<MethodResponse | MethodFault, string>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as string;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Creating a new distro group failed with code "' +
                data.faultCode +
                '" and error message "' +
                data.faultString +
                '"',
            );
          }
          throw new Error('Unexpected response type');
        },
      ),
    );
  }

  new_profile_group(token: string): Observable<string> {
    return this.client.methodCall('new_profile_group', [token]).pipe(
      map<MethodResponse | MethodFault, string>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as string;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Creating a new profile group failed with code "' +
                data.faultCode +
                '" and error message "' +
                data.faultString +
                '"',
            );
          }
          throw new Error('Unexpected response type');
        },
      ),
    );
  }

  new_system_group(token: string): Observable<string> {
    return this.client.methodCall('new_system_group', [token]).pipe(
      map<MethodResponse | MethodFault, string>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as string;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Creating a new system group failed with code "' +
                data.faultCode +
                '" and error message "' +
                data.faultString +
                '"',
            );
          }
          throw new Error('Unexpected response type');
        },
      ),
    );
  }

  modify_item(
    what: string,
    objectId: string,
    attribute: Array<string>,
    arg: AttributeValue,
    token: string,
  ): Observable<boolean> {
    return this.client
      .methodCall('modify_item', [
        what,
        objectId,
        attribute,
        arg as unknown as XmlRpcStruct,
        token,
      ])
      .pipe(
        map<MethodResponse | MethodFault, boolean>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as boolean;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Modifying the requested item failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  modify_distro(
    objectId: string,
    attribute: Array<string>,
    arg: any,
    token: string,
  ): Observable<boolean> {
    return this.client
      .methodCall('modify_distro', [objectId, attribute, arg, token])
      .pipe(
        map<MethodResponse | MethodFault, boolean>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as boolean;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Modifying the requested distro failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  modify_profile(
    objectId: string,
    attribute: Array<string>,
    arg: any,
    token: string,
  ): Observable<boolean> {
    return this.client
      .methodCall('modify_profile', [objectId, attribute, arg, token])
      .pipe(
        map<MethodResponse | MethodFault, boolean>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as boolean;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Modifying the requested profile failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  modify_system(
    objectId: string,
    attribute: Array<string>,
    arg: any,
    token: string,
  ): Observable<boolean> {
    return this.client
      .methodCall('modify_system', [objectId, attribute, arg, token])
      .pipe(
        map<MethodResponse | MethodFault, boolean>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as boolean;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Modifying the requested system failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  modify_image(
    objectId: string,
    attribute: Array<string>,
    arg: any,
    token: string,
  ): Observable<boolean> {
    return this.client
      .methodCall('modify_image', [objectId, attribute, arg, token])
      .pipe(
        map<MethodResponse | MethodFault, boolean>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as boolean;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Modifying the requested image failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  modify_repo(
    objectId: string,
    attribute: Array<string>,
    arg: any,
    token: string,
  ): Observable<boolean> {
    return this.client
      .methodCall('modify_repo', [objectId, attribute, arg, token])
      .pipe(
        map<MethodResponse | MethodFault, boolean>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as boolean;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Modifying the requested repository failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  modify_menu(
    objectId: string,
    attribute: Array<string>,
    arg: any,
    token: string,
  ): Observable<boolean> {
    return this.client
      .methodCall('modify_menu', [objectId, attribute, arg, token])
      .pipe(
        map<MethodResponse | MethodFault, boolean>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as boolean;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Modifying the requested menu failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  modify_network_interface(
    objectId: string,
    attribute: Array<string>,
    arg: any,
    token: string,
  ): Observable<boolean> {
    return this.client
      .methodCall('modify_network_interface', [objectId, attribute, arg, token])
      .pipe(
        map<MethodResponse | MethodFault, boolean>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as boolean;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Modifying the requested network interface failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  modify_template(
    objectId: string,
    attribute: Array<string>,
    arg: any,
    token: string,
  ): Observable<boolean> {
    return this.client
      .methodCall('modify_template', [objectId, attribute, arg, token])
      .pipe(
        map<MethodResponse | MethodFault, boolean>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as boolean;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Modifying the requested template failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  modify_distro_group(
    objectId: string,
    attribute: Array<string>,
    arg: any,
    token: string,
  ): Observable<boolean> {
    return this.client
      .methodCall('modify_distro_group', [objectId, attribute, arg, token])
      .pipe(
        map<MethodResponse | MethodFault, boolean>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as boolean;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Modifying the requested distro group failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  modify_profile_group(
    objectId: string,
    attribute: Array<string>,
    arg: any,
    token: string,
  ): Observable<boolean> {
    return this.client
      .methodCall('modify_profile_group', [objectId, attribute, arg, token])
      .pipe(
        map<MethodResponse | MethodFault, boolean>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as boolean;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Modifying the requested profile group failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  modify_system_group(
    objectId: string,
    attribute: Array<string>,
    arg: any,
    token: string,
  ): Observable<boolean> {
    return this.client
      .methodCall('modify_system_group', [objectId, attribute, arg, token])
      .pipe(
        map<MethodResponse | MethodFault, boolean>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as boolean;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Modifying the requested system group failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  modify_setting(
    name: string,
    value: ModifyValue,
    token: string,
  ): Observable<number> {
    return this.client
      .methodCall('modify_setting', [
        name,
        value as unknown as XmlRpcStruct,
        token,
      ])
      .pipe(
        map<MethodResponse | MethodFault, number>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as number;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Modifying the requested setting failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  auto_add_repos(token: string): Observable<boolean> {
    return this.client.methodCall('auto_add_repos', [token]).pipe(
      map<MethodResponse | MethodFault, boolean>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as boolean;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Auto adding the repositories failed with code "' +
                data.faultCode +
                '" and error message "' +
                data.faultString +
                '"',
            );
          }
          throw new Error('Unexpected response type');
        },
      ),
    );
  }

  save_item(
    what: string,
    objectId: string,
    withTriggers = true,
    withSync = true,
    editMode = 'bypass',
    token: string,
  ): Observable<boolean> {
    return this.client
      .methodCall('save_item', [
        what,
        objectId,
        withTriggers,
        withSync,
        editMode,
        token,
      ])
      .pipe(
        map<MethodResponse | MethodFault, boolean>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as boolean;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Saving the requested item failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  save_distro(
    objectId: string,
    withTriggers = true,
    withSync = true,
    editMode = 'bypass',
    token: string,
  ): Observable<boolean> {
    return this.client
      .methodCall('save_distro', [
        objectId,
        withTriggers,
        withSync,
        editMode,
        token,
      ])
      .pipe(
        map<MethodResponse | MethodFault, boolean>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as boolean;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Saving the requested distro failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  save_profile(
    objectId: string,
    withTriggers = true,
    withSync = true,
    editMode = 'bypass',
    token: string,
  ): Observable<boolean> {
    return this.client
      .methodCall('save_profile', [
        objectId,
        withTriggers,
        withSync,
        editMode,
        token,
      ])
      .pipe(
        map<MethodResponse | MethodFault, boolean>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as boolean;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Saving the requested profile failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  save_system(
    objectId: string,
    withTriggers = true,
    withSync = true,
    editMode = 'bypass',
    token: string,
  ): Observable<boolean> {
    return this.client
      .methodCall('save_system', [
        objectId,
        withTriggers,
        withSync,
        editMode,
        token,
      ])
      .pipe(
        map<MethodResponse | MethodFault, boolean>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as boolean;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Saving the requested system failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  save_image(
    objectId: string,
    withTriggers = true,
    withSync = true,
    editMode = 'bypass',
    token: string,
  ): Observable<boolean> {
    return this.client
      .methodCall('save_image', [
        objectId,
        withTriggers,
        withSync,
        editMode,
        token,
      ])
      .pipe(
        map<MethodResponse | MethodFault, boolean>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as boolean;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Saving the requested image failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  save_repo(
    objectId: string,
    withTriggers = true,
    withSync = true,
    editMode = 'bypass',
    token: string,
  ): Observable<boolean> {
    return this.client
      .methodCall('save_repo', [
        objectId,
        withTriggers,
        withSync,
        editMode,
        token,
      ])
      .pipe(
        map<MethodResponse | MethodFault, boolean>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as boolean;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Saving the requested repository failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  save_menu(
    objectId: string,
    withTriggers = true,
    withSync = true,
    editMode = 'bypass',
    token: string,
  ): Observable<boolean> {
    return this.client
      .methodCall('save_menu', [
        objectId,
        withTriggers,
        withSync,
        editMode,
        token,
      ])
      .pipe(
        map<MethodResponse | MethodFault, boolean>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as boolean;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Saving the requested menu failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  save_network_interface(
    objectId: string,
    withTriggers = true,
    withSync = true,
    editMode = 'bypass',
    token: string,
  ): Observable<boolean> {
    return this.client
      .methodCall('save_network_interface', [
        objectId,
        withTriggers,
        withSync,
        editMode,
        token,
      ])
      .pipe(
        map<MethodResponse | MethodFault, boolean>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as boolean;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Saving the requested network interface failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  save_template(
    objectId: string,
    withTriggers = true,
    withSync = true,
    editMode = 'bypass',
    token: string,
  ): Observable<boolean> {
    return this.client
      .methodCall('save_template', [
        objectId,
        withTriggers,
        withSync,
        editMode,
        token,
      ])
      .pipe(
        map<MethodResponse | MethodFault, boolean>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as boolean;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Saving the requested template failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  save_distro_group(
    objectId: string,
    withTriggers = true,
    withSync = true,
    editMode = 'bypass',
    token: string,
  ): Observable<boolean> {
    return this.client
      .methodCall('save_distro_group', [
        objectId,
        withTriggers,
        withSync,
        editMode,
        token,
      ])
      .pipe(
        map<MethodResponse | MethodFault, boolean>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as boolean;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Saving the requested distro group failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  save_profile_group(
    objectId: string,
    withTriggers = true,
    withSync = true,
    editMode = 'bypass',
    token: string,
  ): Observable<boolean> {
    return this.client
      .methodCall('save_profile_group', [
        objectId,
        withTriggers,
        withSync,
        editMode,
        token,
      ])
      .pipe(
        map<MethodResponse | MethodFault, boolean>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as boolean;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Saving the requested profile_group failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  save_system_group(
    objectId: string,
    withTriggers = true,
    withSync = true,
    editMode = 'bypass',
    token: string,
  ): Observable<boolean> {
    return this.client
      .methodCall('save_system_group', [
        objectId,
        withTriggers,
        withSync,
        editMode,
        token,
      ])
      .pipe(
        map<MethodResponse | MethodFault, boolean>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as boolean;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Saving the requested system_group failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  is_autoinstall_in_use(
    ai: string,
    token: string,
    rest?: RestValue,
  ): Observable<boolean> {
    return this.client.methodCall('is_autoinstall_in_use', [ai, token]).pipe(
      map<MethodResponse | MethodFault, boolean>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as boolean;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Checking if the auto-installation is in use failed with code "' +
                data.faultCode +
                '" and error message "' +
                data.faultString +
                '"',
            );
          }
          throw new Error('Unexpected response type');
        },
      ),
    );
  }

  generate_autoinstall(
    objIdentifier: string,
    objType = 'profile',
    objField = 'name',
    autoinstallerFile: string,
    autoinstallerSubfile: string,
  ): Observable<string> {
    return this.client
      .methodCall('generate_autoinstall', [
        objIdentifier,
        objType,
        objField,
        autoinstallerFile,
        autoinstallerSubfile,
      ])
      .pipe(
        map<MethodResponse | MethodFault, string>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as string;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Generating the auto-installation file failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  generate_ipxe(
    profile: string,
    image: string,
    system: string,
    rest?: RestValue,
  ): Observable<string> {
    return this.client
      .methodCall('generate_ipxe', [
        profile,
        image,
        system,
        rest as XmlRpcStruct,
      ])
      .pipe(
        map<MethodResponse | MethodFault, string>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as string;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Generating the requested iPXE data failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  generate_bootcfg(
    profile: string,
    system: string,
    rest?: RestValue,
  ): Observable<string> {
    return this.client.methodCall('generate_bootcfg', [profile, system]).pipe(
      map<MethodResponse | MethodFault, string>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as string;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Generating the boofcfg for the requested profile or system failed with code "' +
                data.faultCode +
                '" and error message "' +
                data.faultString +
                '"',
            );
          }
          throw new Error('Unexpected response type');
        },
      ),
    );
  }

  generate_script(
    profile: string,
    system: string,
    scriptName: string,
  ): Observable<string> {
    return this.client
      .methodCall('generate_script', [profile, system, scriptName])
      .pipe(
        map<MethodResponse | MethodFault, string>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as string;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Generating the requested script for the system or profile failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  dump_vars(
    itemUuid: string,
    formattedOutput = false,
    removeDicts = true,
  ): Observable<Record<string, any> | string> {
    return this.client
      .methodCall('dump_vars', [itemUuid, formattedOutput, removeDicts])
      .pipe(
        map((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            if (formattedOutput === true) {
              return data.value as string;
            }
            return data.value as Record<string, any>;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Dumping vars failed with code "' +
                data.faultCode +
                '" and error message "' +
                data.faultString +
                '"',
            );
          }
          throw new Error('Unexpected response type');
        }),
      );
  }

  get_blended_data(profile: string, system: string): Observable<any> {
    return this.client.methodCall('get_blended_data', [profile, system]).pipe(
      map<MethodResponse | MethodFault, any>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Getting the blended data for the requested profile or system failed with code "' +
                data.faultCode +
                '" and error message "' +
                data.faultString +
                '"',
            );
          }
          throw new Error('Unexpected response type');
        },
      ),
    );
  }

  private convertXmlRpcStructToTypeScriptObject(
    inputStruct: XmlRpcStruct,
  ): object {
    const result_object = {};
    inputStruct.members.forEach((member) => {
      let value;
      if (AngularXmlrpcService.instanceOfXmlRpcArray(member.value)) {
        value = this.convertXmlRpcArrayToTypeScriptArray(member.value);
      } else if (AngularXmlrpcService.instanceOfXmlRpcStruct(member.value)) {
        value = this.convertXmlRpcStructToTypeScriptObject(member.value);
      } else if (member.value === '&lt;&lt;inherit&gt;&gt;') {
        // FIXME: Maybe we need to XML encode this as other strings potentially also could need encoding
        value = '<<inherit>>';
      } else {
        value = member.value;
      }
      result_object[member.name] = value;
    });
    return result_object;
  }

  private convertXmlRpcArrayToTypeScriptArray(
    inputArray: XmlRpcArray,
  ): Array<any> {
    const resultArray = [];
    inputArray.data.forEach((value) => {
      if (AngularXmlrpcService.instanceOfXmlRpcArray(value)) {
        resultArray.push(this.convertXmlRpcArrayToTypeScriptArray(value));
      } else if (AngularXmlrpcService.instanceOfXmlRpcStruct(value)) {
        resultArray.push(this.convertXmlRpcStructToTypeScriptObject(value));
      } else if (value === '&lt;&lt;inherit&gt;&gt;') {
        // FIXME: Maybe we need to XML encode this as other strings potentially also could need encoding
        resultArray.push('<<inherit>>');
      } else {
        resultArray.push(value);
      }
    });
    return resultArray;
  }

  get_settings(token: string, rest?: RestValue): Observable<Settings> {
    return this.client.methodCall('get_settings', [token]).pipe(
      map<MethodResponse | MethodFault, Settings>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            if (data.value instanceof Map) {
              return Object.fromEntries(data.value.entries()) as Settings;
            }
            throw new Error(
              'The return value of the settings was not in the expected format of an XML-RPC Struct!',
            );
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Retrieving the settings failed with code "' +
                data.faultCode +
                '" and error message "' +
                data.faultString +
                '"',
            );
          }
          throw new Error('Unexpected response type');
        },
      ),
    );
  }

  get_signatures(
    token: string,
    rest?: RestValue,
  ): Observable<DistroSignatures> {
    return this.client.methodCall('get_signatures', [token]).pipe(
      map<MethodResponse | MethodFault, Map<string, XmlRpcTypes>>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as Map<string, XmlRpcTypes>;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Getting the signatures failed with code "' +
                data.faultCode +
                '" and error message "' +
                data.faultString +
                '"',
            );
          }
          throw new Error('Unexpected response type');
        },
      ),
      map<Map<string, XmlRpcTypes>, DistroSignatures>(
        (value): DistroSignatures => {
          let result: DistroSignatures = { breeds: {} };
          value.forEach((breedStruct, mainBreedKey) => {
            if (!(breedStruct instanceof Map)) {
              throw new Error('Expected to receive Map for breedStruct!');
            }
            breedStruct.forEach((osVersionStruct, osBreedName) => {
              if (!(osVersionStruct instanceof Map)) {
                throw new Error('Expected to receive Map for osVersionStruct!');
              }
              result.breeds[osBreedName] = {};
              osVersionStruct.forEach((osVersionValueStruct, osVersionName) => {
                if (!(osVersionValueStruct instanceof Map)) {
                  throw new Error(
                    'Expected to receive Map for osVersionValueStruct!',
                  );
                }
                // @ts-ignore - Due to this being dynamically filled
                result.breeds[osBreedName][osVersionName] = {};
                osVersionValueStruct.forEach(
                  (attributeValue, attributeName) => {
                    result.breeds[osBreedName][osVersionName][attributeName] =
                      attributeValue;
                  },
                );
              });
            });
          });
          return result;
        },
      ),
    );
  }

  get_valid_breeds(token: string, rest?: RestValue): Observable<Array<string>> {
    return this.client.methodCall('get_valid_breeds', [token]).pipe(
      map<MethodResponse | MethodFault, Array<any>>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as unknown as Array<any>;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Getting the valid breeds failed with code "' +
                data.faultCode +
                '" and error message "' +
                data.faultString +
                '"',
            );
          }
          throw new Error('Unexpected response type');
        },
      ),
    );
  }

  get_valid_os_versions_for_breed(
    breed: string,
    token: string,
    rest?: RestValue,
  ): Observable<Array<string>> {
    return this.client
      .methodCall('get_valid_os_versions_for_breed', [breed, token])
      .pipe(
        map<MethodResponse | MethodFault, Array<any>>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as unknown as Array<any>;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Getting the valid OS versions for the requested breed failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  get_valid_os_versions(token: string): Observable<Array<string>> {
    return this.client.methodCall('get_valid_os_versions', [token]).pipe(
      map<MethodResponse | MethodFault, Array<any>>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as unknown as Array<any>;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Getting the valid OS versions failed with code "' +
                data.faultCode +
                '" and error message "' +
                data.faultString +
                '"',
            );
          }
          throw new Error('Unexpected response type');
        },
      ),
    );
  }

  get_valid_archs(token: string): Observable<Array<string>> {
    return this.client.methodCall('get_valid_archs', [token]).pipe(
      map<MethodResponse | MethodFault, Array<string>>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            // FIXME: Make the cast without the unknown possible
            return data.value as unknown as Array<string>;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Getting the valid architectures for the requested system failed with code "' +
                data.faultCode +
                '" and error message "' +
                data.faultString +
                '"',
            );
          }
          throw new Error('Unexpected response type');
        },
      ),
    );
  }

  get_valid_distro_bootloaders(
    distroName: string,
    token: string,
  ): Observable<Array<string>> {
    return this.client
      .methodCall('get_valid_distro_boot_loaders', [distroName, token])
      .pipe(
        map<MethodResponse | MethodFault, Array<string>>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as Array<string>;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Getting the valid distro boot loaders for the requested distro failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  get_valid_profile_bootloaders(
    profileName: string,
    token: string,
  ): Observable<Array<string>> {
    return this.client
      .methodCall('get_valid_profile_boot_loaders', [profileName, token])
      .pipe(
        map<MethodResponse | MethodFault, Array<string>>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as Array<string>;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Getting the valid profile boot loaders for the requested profile failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  get_valid_image_bootloaders(
    imageName: string,
    token: string,
  ): Observable<Array<string>> {
    return this.client
      .methodCall('get_valid_image_boot_loaders', [imageName, token])
      .pipe(
        map<MethodResponse | MethodFault, Array<string>>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as Array<string>;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Getting the valid image boot loaders for the requested image failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  get_valid_system_bootloaders(
    systemName: string,
    token: string,
  ): Observable<Array<string>> {
    return this.client
      .methodCall('get_valid_system_boot_loaders', [systemName, token])
      .pipe(
        map<MethodResponse | MethodFault, Array<string>>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as Array<string>;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Getting the valid system boot loaders for the requested system failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  get_repo_config_for_profile(
    profileName: string,
    rest?: RestValue,
  ): Observable<string> {
    return this.client
      .methodCall('get_repo_config_for_profile', [profileName])
      .pipe(
        map<MethodResponse | MethodFault, string>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as string;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Getting the repository configuration for the requested profile failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  get_repo_config_for_system(
    systemName: string,
    rest?: RestValue,
  ): Observable<string> {
    return this.client
      .methodCall('get_repo_config_for_system', [systemName])
      .pipe(
        map<MethodResponse | MethodFault, string>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as string;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Getting the repository configuration for the requested system failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  get_template_file_for_profile(
    profileName: string,
    path: string,
    rest?: RestValue,
  ): Observable<string> {
    return this.client
      .methodCall('get_template_file_for_profile', [profileName, path])
      .pipe(
        map<MethodResponse | MethodFault, string>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as string;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Getting the requested templdate for the requested profile failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  get_template_file_for_system(
    systemName: string,
    path: string,
    rest?: RestValue,
  ): Observable<string> {
    return this.client
      .methodCall('get_template_file_for_system', [systemName, path])
      .pipe(
        map<MethodResponse | MethodFault, string>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as string;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Getting the requested template for requested the system failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  register_new_system(
    info: RegisterOptions,
    token: string,
    rest?: RestValue,
  ): Observable<boolean> {
    const transformedOptions: XmlRpcStruct = {
      members: [
        { name: 'name', value: info.name },
        { name: 'profile', value: info.profile },
        { name: 'hostname', value: info.hostname },
        { name: 'interfaces', value: info.interfaces as XmlRpcStruct },
      ],
    };
    return this.client
      .methodCall('register_new_system', [transformedOptions, token])
      .pipe(
        map<MethodResponse | MethodFault, boolean>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as boolean;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Registering a new system failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  disable_netboot(
    name: string,
    token: string,
    rest?: RestValue,
  ): Observable<boolean> {
    return this.client.methodCall('disable_netboot', [name, token]).pipe(
      map<MethodResponse | MethodFault, boolean>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as boolean;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Disabling netboot for the requested system failed with code "' +
                data.faultCode +
                '" and error message "' +
                data.faultString +
                '"',
            );
          }
          throw new Error('Unexpected response type');
        },
      ),
    );
  }

  upload_log_data(
    sysName: string,
    file: string,
    size: number,
    offset: number,
    data = 'xmlrpc.client.Binary',
    token: string,
  ): Observable<boolean> {
    return this.client
      .methodCall('upload_log_data', [sysName, file, size, offset, data, token])
      .pipe(
        map<MethodResponse | MethodFault, boolean>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as boolean;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Uploading the log data failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  run_install_triggers(
    mode: string,
    objType: string,
    name: string,
    ip: string,
    token: string,
    rest?: RestValue,
  ): Observable<boolean> {
    return this.client
      .methodCall('run_install_triggers', [mode, objType, name, ip, token])
      .pipe(
        map<MethodResponse | MethodFault, boolean>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as boolean;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Running the install triggers failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  version(rest?: RestValue): Observable<number> {
    return this.client.methodCall('version').pipe(
      map<MethodResponse | MethodFault, number>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as number;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Getting the Cobbler version failed with code "' +
                data.faultCode +
                '" and error message "' +
                data.faultString +
                '"',
            );
          }
          throw new Error('Unexpected response type');
        },
      ),
    );
  }

  extended_version(rest?: RestValue): Observable<ExtendedVersion> {
    return this.client.methodCall('extended_version').pipe(
      map<MethodResponse | MethodFault, Map<string, any>>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as Map<string, any>;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Getting the extended Cobbler version failed with code "' +
                data.faultCode +
                '" and error message "' +
                data.faultString +
                '"',
            );
          }
          throw new Error('Unexpected response type');
        },
      ),
      map<Map<string, any>, ExtendedVersion>((data: Map<string, any>) => {
        const versionArray = data.get('version_tuple') as Array<any>;
        return {
          gitdate: data.get('gitdate'),
          gitstamp: data.get('gitstamp'),
          builddate: data.get('builddate'),
          version: data.get('version'),
          versionTuple: {
            major: versionArray[0],
            minor: versionArray[1],
            patch: versionArray[2],
          } as Version,
        } as ExtendedVersion;
      }),
    );
  }

  get_distros_since(mtime: number): Observable<ResolvedValue> {
    return this.client.methodCall('get_distros_since', [mtime]).pipe(
      map<MethodResponse | MethodFault, ResolvedValue>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as ResolvedValue;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Getting the distros modified since the requested mtime failed with code "' +
                data.faultCode +
                '" and error message "' +
                data.faultString +
                '"',
            );
          }
          throw new Error('Unexpected response type');
        },
      ),
    );
  }

  get_profiles_since(mtime: number): Observable<ResolvedValue> {
    return this.client.methodCall('get_profiles_since', [mtime]).pipe(
      map<MethodResponse | MethodFault, ResolvedValue>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as ResolvedValue;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Getting the profiles modified since the requested mtime failed with code "' +
                data.faultCode +
                '" and error message "' +
                data.faultString +
                '"',
            );
          }
          throw new Error('Unexpected response type');
        },
      ),
    );
  }

  get_systems_since(mtime: number): Observable<ResolvedValue> {
    return this.client.methodCall('get_systems_since', [mtime]).pipe(
      map<MethodResponse | MethodFault, ResolvedValue>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as ResolvedValue;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Getting the systems modified since the requested mtime failed with code "' +
                data.faultCode +
                '" and error message "' +
                data.faultString +
                '"',
            );
          }
          throw new Error('Unexpected response type');
        },
      ),
    );
  }

  get_repos_since(mtime: number): Observable<ResolvedValue> {
    return this.client.methodCall('get_repos_since', [mtime]).pipe(
      map<MethodResponse | MethodFault, ResolvedValue>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as ResolvedValue;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Getting the repositories modified since the requested mtime failed with code "' +
                data.faultCode +
                '" and error message "' +
                data.faultString +
                '"',
            );
          }
          throw new Error('Unexpected response type');
        },
      ),
    );
  }

  get_images_since(mtime: number): Observable<ResolvedValue> {
    return this.client.methodCall('get_images_since', [mtime]).pipe(
      map<MethodResponse | MethodFault, ResolvedValue>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as ResolvedValue;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Getting the images modified since the requested mtime failed with code "' +
                data.faultCode +
                '" and error message "' +
                data.faultString +
                '"',
            );
          }
          throw new Error('Unexpected response type');
        },
      ),
    );
  }

  get_menus_since(mtime: number): Observable<ResolvedValue> {
    return this.client.methodCall('get_menus_since', [mtime]).pipe(
      map<MethodResponse | MethodFault, ResolvedValue>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as ResolvedValue;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Getting the menus modified since the requested mtime failed with code "' +
                data.faultCode +
                '" and error message "' +
                data.faultString +
                '"',
            );
          }
          throw new Error('Unexpected response type');
        },
      ),
    );
  }

  get_network_interfaces_since(mtime: number): Observable<ResolvedValue> {
    return this.client.methodCall('get_network_interfaces_since', [mtime]).pipe(
      map<MethodResponse | MethodFault, ResolvedValue>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as ResolvedValue;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Getting the network interfaces modified since the requested mtime failed with code "' +
                data.faultCode +
                '" and error message "' +
                data.faultString +
                '"',
            );
          }
          throw new Error('Unexpected response type');
        },
      ),
    );
  }

  get_templates_since(mtime: number): Observable<ResolvedValue> {
    return this.client.methodCall('get_templates_since', [mtime]).pipe(
      map<MethodResponse | MethodFault, ResolvedValue>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as ResolvedValue;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Getting the templates modified since the requested mtime failed with code "' +
                data.faultCode +
                '" and error message "' +
                data.faultString +
                '"',
            );
          }
          throw new Error('Unexpected response type');
        },
      ),
    );
  }

  get_distro_groups_since(mtime: number): Observable<ResolvedValue> {
    return this.client.methodCall('get_distro_groups_since', [mtime]).pipe(
      map<MethodResponse | MethodFault, ResolvedValue>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as ResolvedValue;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Getting the distro groups modified since the requested mtime failed with code "' +
                data.faultCode +
                '" and error message "' +
                data.faultString +
                '"',
            );
          }
          throw new Error('Unexpected response type');
        },
      ),
    );
  }

  get_profile_groups_since(mtime: number): Observable<ResolvedValue> {
    return this.client.methodCall('get_profile_groups_since', [mtime]).pipe(
      map<MethodResponse | MethodFault, ResolvedValue>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as ResolvedValue;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Getting the profile groups modified since the requested mtime failed with code "' +
                data.faultCode +
                '" and error message "' +
                data.faultString +
                '"',
            );
          }
          throw new Error('Unexpected response type');
        },
      ),
    );
  }

  get_system_groups_since(mtime: number): Observable<ResolvedValue> {
    return this.client.methodCall('get_system_groups_since', [mtime]).pipe(
      map<MethodResponse | MethodFault, ResolvedValue>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as ResolvedValue;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Getting the system groups modified since the requested mtime failed with code "' +
                data.faultCode +
                '" and error message "' +
                data.faultString +
                '"',
            );
          }
          throw new Error('Unexpected response type');
        },
      ),
    );
  }

  get_repos_compatible_with_profile(
    profile: string,
    token: string,
    rest?: RestValue,
  ): Observable<Array<Record<string, unknown>>> {
    return this.client
      .methodCall('get_repos_compatible_with_profile', [profile, token])
      .pipe(
        map<MethodResponse | MethodFault, Array<Record<string, unknown>>>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as unknown as Array<Record<string, unknown>>;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Getting the repositories compatible with the requested profile failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  find_system_by_dns_name(dnsName: string): Observable<Record<string, any>> {
    return this.client.methodCall('find_system_by_dns_name', [dnsName]).pipe(
      map<MethodResponse | MethodFault, Record<string, any>>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as Record<string, any>;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Finding a system by its DNS name failed with code "' +
                data.faultCode +
                '" and error message "' +
                data.faultString +
                '"',
            );
          }
          throw new Error('Unexpected response type');
        },
      ),
    );
  }

  get_distro_as_rendered(
    name: string,
    token: string,
    rest?: RestValue,
  ): Observable<ResolvedValue> {
    return this.client.methodCall('get_distro_as_rendered', [name, token]).pipe(
      map<MethodResponse | MethodFault, ResolvedValue>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as ResolvedValue;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Getting the requested distro in a rendered format failed with code "' +
                data.faultCode +
                '" and error message "' +
                data.faultString +
                '"',
            );
          }
          throw new Error('Unexpected response type');
        },
      ),
    );
  }

  get_profile_as_rendered(
    name: string,
    token: string,
    rest?: RestValue,
  ): Observable<ResolvedValue> {
    return this.client
      .methodCall('get_profile_as_rendered', [name, token])
      .pipe(
        map<MethodResponse | MethodFault, ResolvedValue>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as ResolvedValue;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Getting the requested profile in a rendered format failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  get_system_as_rendered(
    name: string,
    token: string,
    rest?: RestValue,
  ): Observable<ResolvedValue> {
    return this.client.methodCall('get_system_as_rendered', [name, token]).pipe(
      map<MethodResponse | MethodFault, ResolvedValue>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as ResolvedValue;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Getting the requested system in a rendered format failed with code "' +
                data.faultCode +
                '" and error message "' +
                data.faultString +
                '"',
            );
          }
          throw new Error('Unexpected response type');
        },
      ),
    );
  }

  get_repo_as_rendered(
    name: string,
    token: string,
    rest?: RestValue,
  ): Observable<ResolvedValue> {
    return this.client.methodCall('get_repo_as_rendered', [name, token]).pipe(
      map<MethodResponse | MethodFault, ResolvedValue>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as ResolvedValue;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Getting the requested repository in a rendered format failed with code "' +
                data.faultCode +
                '" and error message "' +
                data.faultString +
                '"',
            );
          }
          throw new Error('Unexpected response type');
        },
      ),
    );
  }

  get_image_as_rendered(
    name: string,
    token: string,
    rest?: RestValue,
  ): Observable<ResolvedValue> {
    return this.client.methodCall('get_image_as_rendered', [name, token]).pipe(
      map<MethodResponse | MethodFault, ResolvedValue>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as ResolvedValue;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Getting the requested image in a rendered format failed with code "' +
                data.faultCode +
                '" and error message "' +
                data.faultString +
                '"',
            );
          }
          throw new Error('Unexpected response type');
        },
      ),
    );
  }

  get_menu_as_rendered(
    name: string,
    token: string,
    rest?: RestValue,
  ): Observable<ResolvedValue> {
    return this.client.methodCall('get_menu_as_rendered', [name, token]).pipe(
      map<MethodResponse | MethodFault, ResolvedValue>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as ResolvedValue;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Getting the requested menu in a rendered format failed with code "' +
                data.faultCode +
                '" and error message "' +
                data.faultString +
                '"',
            );
          }
          throw new Error('Unexpected response type');
        },
      ),
    );
  }

  get_distro_group_as_rendered(
    name: string,
    token: string,
    rest?: RestValue,
  ): Observable<ResolvedValue> {
    return this.client
      .methodCall('get_distro_group_as_rendered', [name, token])
      .pipe(
        map<MethodResponse | MethodFault, ResolvedValue>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as ResolvedValue;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Getting the requested distro group in a rendered format failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  get_profile_group_as_rendered(
    name: string,
    token: string,
    rest?: RestValue,
  ): Observable<ResolvedValue> {
    return this.client
      .methodCall('get_profile_group_as_rendered', [name, token])
      .pipe(
        map<MethodResponse | MethodFault, ResolvedValue>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as ResolvedValue;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Getting the requested profile group in a rendered format failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  get_system_group_as_rendered(
    name: string,
    token: string,
    rest?: RestValue,
  ): Observable<ResolvedValue> {
    return this.client
      .methodCall('get_system_group_as_rendered', [name, token])
      .pipe(
        map<MethodResponse | MethodFault, ResolvedValue>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as ResolvedValue;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Getting the requested system group in a rendered format failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  get_random_mac(
    virtType = 'kvm',
    token: string,
    rest?: RestValue,
  ): Observable<string> {
    return this.client.methodCall('get_random_mac', [virtType, token]).pipe(
      map<MethodResponse | MethodFault, string>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as string;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Getting a random MAC address failed with code "' +
                data.faultCode +
                '" and error message "' +
                data.faultString +
                '"',
            );
          }
          throw new Error('Unexpected response type');
        },
      ),
    );
  }

  xmlrpc_hacks(data: XmlrpcHacksInput): Observable<ResolvedValue> {
    return this.client
      .methodCall('xmlrpc_hacks', [data as unknown as XmlRpcStruct])
      .pipe(
        map<MethodResponse | MethodFault, ResolvedValue>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as ResolvedValue;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Executing the XML-RPC hacks failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  get_status(
    mode = 'normal',
    token: string,
    rest?: RestValue,
  ): Observable<Array<InstallationStatus>> {
    return this.client.methodCall('get_status', [mode, token]).pipe(
      map<MethodResponse | MethodFault, Map<string, any>>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as Map<string, any>;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Getting the status failed with code "' +
                data.faultCode +
                '" and error message "' +
                data.faultString +
                '"',
            );
          }
          throw new Error('Unexpected response type');
        },
      ),
      map<Map<string, any>, Array<InstallationStatus>>(
        (data: Map<string, any>) => {
          let result: Array<InstallationStatus> = [];
          data.forEach((value, key) => {
            const membersArray = value as Array<any>;
            result.push({
              ip: key,
              mostRecentStart: membersArray[0] as number,
              mostRecentStop: membersArray[1] as number,
              mostRecentTarget: membersArray[2] as string,
              seenStart: membersArray[3] as number,
              seenStop: membersArray[4] as number,
              state: membersArray[5] as string,
            });
          });
          return result;
        },
      ),
    );
  }

  check_access_no_fail(
    token: string,
    resource: string,
    arg1: string,
    arg2: any,
  ): Observable<number> {
    return this.client
      .methodCall('check_access_no_fail', [token, resource, arg1, arg2])
      .pipe(
        map<MethodResponse | MethodFault, number>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as number;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Checking the access without failure failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  check_access(
    token: string,
    resource: string,
    arg1: string,
    arg2: any,
  ): Observable<number> {
    return this.client
      .methodCall('check_access', [token, resource, arg1, arg2])
      .pipe(
        map<MethodResponse | MethodFault, number>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as number;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Checking the access failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  get_authn_module_name(token: string): Observable<string> {
    return this.client.methodCall('get_authn_module_name', [token]).pipe(
      map<MethodResponse | MethodFault, string>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as string;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Getting the authentication module name failed with code "' +
                data.faultCode +
                '" and error message "' +
                data.faultString +
                '"',
            );
          }
          throw new Error('Unexpected response type');
        },
      ),
    );
  }

  login(username: string, password: string): Observable<string> {
    return this.client.methodCall('login', [username, password]).pipe(
      map<MethodResponse | MethodFault, string>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as string;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Login failed with code "' +
                data.faultCode +
                '" and error message "' +
                data.faultString +
                '"',
            );
          }
          throw new Error('Unexpected response type');
        },
      ),
    );
  }

  logout(token: string): Observable<boolean> {
    return this.client.methodCall('logout', [token]).pipe(
      map<MethodResponse | MethodFault, boolean>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as boolean;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Logout failed with code "' +
                data.faultCode +
                '" and error message "' +
                data.faultString +
                '"',
            );
          }
          throw new Error('Unexpected response type');
        },
      ),
    );
  }

  token_check(token: string): Observable<boolean> {
    return this.client.methodCall('token_check', [token]).pipe(
      map<MethodResponse | MethodFault, boolean>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as boolean;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Check of the token failed with code "' +
                data.faultCode +
                '" and error message "' +
                data.faultString +
                '"',
            );
          }
          throw new Error('Unexpected response type');
        },
      ),
    );
  }

  sync_dhcp(token: string): Observable<boolean> {
    return this.client.methodCall('sync_dhcp', [token]).pipe(
      map<MethodResponse | MethodFault, boolean>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as boolean;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'The sync DHCP action failed with code "' +
                data.faultCode +
                '" and error message "' +
                data.faultString +
                '"',
            );
          }
          throw new Error('Unexpected response type');
        },
      ),
    );
  }

  sync(token: string): Observable<boolean> {
    return this.client.methodCall('sync', [token]).pipe(
      map<MethodResponse | MethodFault, boolean>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as boolean;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'The sync action failed with code "' +
                data.faultCode +
                '" and error message "' +
                data.faultString +
                '"',
            );
          }
          throw new Error('Unexpected response type');
        },
      ),
    );
  }

  get_config_data(hostname: string): Observable<string> {
    return this.client.methodCall('get_config_data', [hostname]).pipe(
      map<MethodResponse | MethodFault, string>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as string;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Retrieving the configuration data failed with code "' +
                data.faultCode +
                '" and error message "' +
                data.faultString +
                '"',
            );
          }
          throw new Error('Unexpected response type');
        },
      ),
    );
  }

  clear_system_logs(objectId: string, token: string): Observable<boolean> {
    return this.client.methodCall('clear_system_logs', [objectId, token]).pipe(
      map<MethodResponse | MethodFault, boolean>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as boolean;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Clearing the system logs failed with code "' +
                data.faultCode +
                '" and error message "' +
                data.faultString +
                '"',
            );
          }
          throw new Error('Unexpected response type');
        },
      ),
    );
  }

  input_string_or_list_no_inherit(
    options: string | Array<any>,
  ): Observable<Array<any>> {
    return this.client
      .methodCall('input_string_or_list_no_inherit', [options])
      .pipe(
        map<MethodResponse | MethodFault, Array<any>>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as Array<any>;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Converting input string or list no inherit failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  input_string_or_list(
    options: string | Array<any>,
  ): Observable<Array<any> | string> {
    return this.client.methodCall('input_string_or_list', [options]).pipe(
      map<MethodResponse | MethodFault, Array<any> | string>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as Array<any> | string;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Converting input string or list failed with code "' +
                data.faultCode +
                '" and error message "' +
                data.faultString +
                '"',
            );
          }
          throw new Error('Unexpected response type');
        },
      ),
    );
  }

  input_string_or_dict_no_inherit(
    options: string | Array<any> | Record<string, unknown>,
    allowMultiples = true,
  ): Observable<string | Record<string, unknown>> {
    return this.client
      .methodCall('input_string_or_dict_no_inherit', [
        options as unknown as XmlRpcStruct,
        allowMultiples,
      ])
      .pipe(
        map<MethodResponse | MethodFault, string | Record<string, unknown>>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as string | Record<string, unknown>;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Converting input string or dictionary no inherit failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString,
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  input_string_or_dict(
    options: string | Array<any> | Record<string, unknown>,
    allowMultiples = true,
  ): Observable<string | Record<string, unknown>> {
    return this.client
      .methodCall('input_string_or_dict', [
        options as unknown as XmlRpcStruct,
        allowMultiples,
      ])
      .pipe(
        map<MethodResponse | MethodFault, string | Record<string, unknown>>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as string | Record<string, unknown>;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Converting input string or dictionary failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString,
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  input_boolean(value: string | boolean | number): Observable<boolean> {
    return this.client.methodCall('input_boolean', [value]).pipe(
      map<MethodResponse | MethodFault, boolean>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as boolean;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Converting input boolean failed with code "' +
                data.faultCode +
                '" and error message "' +
                data.faultString +
                '"',
            );
          }
          throw new Error('Unexpected response type');
        },
      ),
    );
  }

  input_int(value: string | number): Observable<number> {
    return this.client.methodCall('input_int', [value]).pipe(
      map<MethodResponse | MethodFault, number>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as number;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Converting input integer failed with code "' +
                data.faultCode +
                '" and error message "' +
                data.faultString +
                '"',
            );
          }
          throw new Error('Unexpected response type');
        },
      ),
    );
  }

  get_tftp_file(
    path: string,
    offset: number,
    size: number,
    token: string,
  ): Observable<TftpFileResult> {
    return this.client
      .methodCall('get_tftp_file', [path, offset, size, token])
      .pipe(
        map<MethodResponse | MethodFault, TftpFileResult>(
          (data: MethodResponse | MethodFault) => {
            if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
              return data.value as TftpFileResult;
            } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
              throw new Error(
                'Getting the requested TFTP file failed with code "' +
                  data.faultCode +
                  '" and error message "' +
                  data.faultString +
                  '"',
              );
            }
            throw new Error('Unexpected response type');
          },
        ),
      );
  }

  transaction_begin(token: string): Observable<boolean> {
    return this.client.methodCall('transaction_begin', [token]).pipe(
      map<MethodResponse | MethodFault, boolean>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as boolean;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Beginning the transaction failed with code "' +
                data.faultCode +
                '" and error message "' +
                data.faultString +
                '"',
            );
          }
          throw new Error('Unexpected response type');
        },
      ),
    );
  }

  transaction_commit(token: string): Observable<boolean> {
    return this.client.methodCall('transaction_commit', [token]).pipe(
      map<MethodResponse | MethodFault, boolean>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as boolean;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Commiting the current transaction failed with code "' +
                data.faultCode +
                '" and error message "' +
                data.faultString +
                '"',
            );
          }
          throw new Error('Unexpected response type');
        },
      ),
    );
  }

  transaction_abort(token: string): Observable<boolean> {
    return this.client.methodCall('transaction_abort', [token]).pipe(
      map<MethodResponse | MethodFault, boolean>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as boolean;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Aborting the current transaction failed with code "' +
                data.faultCode +
                '" and error message "' +
                data.faultString +
                '"',
            );
          }
          throw new Error('Unexpected response type');
        },
      ),
    );
  }
}

import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  AngularXmlrpcService,
  MethodResponse,
  MethodFault,
  XmlRpcStruct,
  XmlRpcTypes,
} from 'typescript-xmlrpc';
import { Settings } from './custom-types/settings';
import { COBBLER_URL } from './lib.config';
import {
  Distro,
  DistroGroup,
  Image,
  Profile,
  ProfileGroup,
  Repo,
  System,
  SystemGroup,
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
    return this.call('check', [token]).pipe(
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
    return this.call('background_buildiso', [transformedOptions, token]).pipe(
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
    return this.call('background_aclsetup', [transformedOptions, token]).pipe(
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
    return this.call('background_sync', [transformedOptions, token]).pipe(
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
        { name: 'systems', value: options.systems },
        { name: 'verbose', value: options.verbose },
      ],
    };
    return this.call('background_syncsystems', [
      transformedOptions,
      token,
    ]).pipe(
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
    return this.call('background_hardlink', [hardlinkOptions, token]).pipe(
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
    return this.call('background_mkloaders', [mkloadersOptions, token]).pipe(
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
    return this.call('background_validate_autoinstall_files', [
      validateAutoinstallOptions,
      token,
    ]).pipe(
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
    return this.call('background_replicate', [transformedOptions, token]).pipe(
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
    return this.call('background_import', [transformedOptions, token]).pipe(
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
        { name: 'repos', value: options.repos },
        { name: 'only', value: options.only },
        { name: 'nofail', value: options.nofail },
        { name: 'tries', value: options.tries },
      ],
    };
    return this.call('background_reposync', [transformedOptions, token]).pipe(
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
        { name: 'systems', value: options.systems },
        { name: 'power', value: options.power },
      ],
    };
    return this.call('background_power_system', [
      transformedOptions,
      token,
    ]).pipe(
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
    return this.call('power_system', [systemId, power, token]).pipe(
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
    return this.call('background_signature_update', [
      signatureUpdateOptions,
      token,
    ]).pipe(
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
    return this.call('background_signature_reload', [
      signatureReloadOptions,
      token,
    ]).pipe(
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
    return this.call('background_templates_refresh_content', [
      templateRefreshContentOptions,
      token,
    ]).pipe(
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
    return this.call('templates_refresh_content', [objects, token]).pipe(
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
    return this.call('get_events', [forUser]).pipe(
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
    return this.call('get_event_log', [eventId]).pipe(
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
    return this.call('get_task_status', [eventId]).pipe(
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
    return this.call('last_modified_time').pipe(
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
    return this.call('ping').pipe(
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
    return this.call('get_user_from_token', [token]).pipe(
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
    const result: Record<string, any> = {};
    xmlrpcStruct.forEach((value, key) => {
      if (key === 'ks_meta' || key === 'kickstart') {
        // Skip legacy keys
        return;
      }
      CobblerApiService.assignStructMember(
        result,
        key,
        this.convertXmlRpcValue(value),
      );
    });
    return result;
  }

  /**
   * Converts the result array of a ``find_*`` XML-RPC method into an array of plain objects.
   *
   * ``find_*`` methods take an ``expand`` parameter: with ``expand=false`` the server returns an array of plain
   * name strings, with ``expand=true`` the array elements are full item structs (deserialized as ``Map``). Only the
   * latter need to be rebuilt via {@link rebuildItem}; strings are returned untouched.
   *
   * @param inputArray The deserialized ``find_*`` result array.
   * @returns The equivalent array with any struct elements converted to plain objects.
   */
  private rebuildFindResults(inputArray: Array<any>): Array<any> {
    return inputArray.map((value) =>
      value instanceof Map ? this.rebuildItem(value) : value,
    );
  }

  // TODO: Create casting magic to output the right item type
  get_item(
    what: string,
    objectId: string,
    flatten: boolean = false,
  ): Observable<object> {
    return this.call('get_item', [what, objectId, flatten]).pipe(
      map<MethodResponse | MethodFault, object>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            if (!(data.value instanceof Map)) {
              throw new Error('Expected Map not something else!');
            }
            return this.rebuildItem(data.value);
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
    objectId: string,
    flatten: boolean = false,
    resolved: boolean = false,
    token: string,
  ): Observable<Distro> {
    return this.call('get_distro', [objectId, flatten, resolved, token]).pipe(
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
    objectId: string,
    flatten: boolean = false,
    resolved: boolean = false,
    token: string,
  ): Observable<Profile> {
    return this.call('get_profile', [objectId, flatten, resolved, token]).pipe(
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
    objectId: string,
    flatten: boolean = false,
    resolved: boolean = false,
    token: string,
  ): Observable<System> {
    return this.call('get_system', [objectId, flatten, resolved, token]).pipe(
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
    objectId: string,
    flatten: boolean = false,
    resolved: boolean = false,
    token: string,
  ): Observable<Repo> {
    return this.call('get_repo', [objectId, flatten, resolved, token]).pipe(
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
    objectId: string,
    flatten: boolean = false,
    resolved: boolean = false,
    token: string,
  ): Observable<Image> {
    return this.call('get_image', [objectId, flatten, resolved, token]).pipe(
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
    objectId: string,
    flatten: boolean = false,
    resolved: boolean = false,
    token: string,
  ): Observable<Menu> {
    return this.call('get_menu', [objectId, flatten, resolved, token]).pipe(
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
    objectId: string,
    flatten = false,
    resolved = false,
    token: string,
  ): Observable<NetworkInterface> {
    return this.call('get_network_interface', [
      objectId,
      flatten,
      resolved,
      token,
    ]).pipe(
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
    return this.call('get_items', [what]).pipe(
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
    return this.call('get_item_names', [what]).pipe(
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
    return this.call('get_item_resolved_value', [itemUuid, attribute]).pipe(
      map<MethodResponse | MethodFault, ResolvedValue>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return this.convertXmlRpcValue(data.value) as ResolvedValue;
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

  set_item_resolved_value(
    itemUuid: string,
    attribute: Array<string>,
    value: any,
    token: string,
  ): Observable<boolean> {
    return this.call('set_item_resolved_value', [
      itemUuid,
      attribute,
      value,
      token,
    ]).pipe(
      map<MethodResponse | MethodFault, boolean>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as boolean;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Setting the resolved item value failed with code "' +
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
    return this.call('get_distros').pipe(
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
    return this.call('get_profiles').pipe(
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
    return this.call('get_systems').pipe(
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
    return this.call('get_repos').pipe(
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
    return this.call('get_images').pipe(
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
    return this.call('get_menus').pipe(
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
    return this.call('get_network_interfaces').pipe(
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
    return this.call('get_templates').pipe(
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
    objectId: string,
    flatten: boolean = false,
    resolved: boolean = false,
    token: string,
  ): Observable<Template> {
    return this.call('get_template', [objectId, flatten, resolved, token]).pipe(
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
    return this.call('find_items', [
      what,
      criteria as XmlRpcStruct,
      sortField,
      expand,
      resolved,
      token,
    ]).pipe(
      map<MethodResponse | MethodFault, Array<any>>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            if (!(data.value instanceof Array)) {
              throw new Error('Expected Array but got something else!');
            }
            return this.rebuildFindResults(data.value);
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
    return this.call('find_distro', [
      criteria as XmlRpcStruct,
      expand,
      resolved,
      token,
    ]).pipe(
      map<MethodResponse | MethodFault, Array<Distro>>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            if (!(data.value instanceof Array)) {
              throw new Error('Expected Array but got something else!');
            }
            return this.rebuildFindResults(data.value) as Array<Distro>;
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
    return this.call('find_profile', [
      criteria as XmlRpcStruct,
      expand,
      resolved,
      token,
    ]).pipe(
      map<MethodResponse | MethodFault, Array<Profile>>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            if (!(data.value instanceof Array)) {
              throw new Error('Expected Array but got something else!');
            }
            return this.rebuildFindResults(data.value) as Array<Profile>;
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
    return this.call('find_system', [
      criteria as XmlRpcStruct,
      expand,
      resolved,
      token,
    ]).pipe(
      map<MethodResponse | MethodFault, Array<System>>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            if (!(data.value instanceof Array)) {
              throw new Error('Expected Array but got something else!');
            }
            return this.rebuildFindResults(data.value) as Array<System>;
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
    return this.call('find_repo', [
      criteria as XmlRpcStruct,
      expand,
      resolved,
      token,
    ]).pipe(
      map<MethodResponse | MethodFault, Array<Repo>>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            if (!(data.value instanceof Array)) {
              throw new Error('Expected Array but got something else!');
            }
            return this.rebuildFindResults(data.value) as Array<Repo>;
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
    return this.call('find_image', [
      criteria as XmlRpcStruct,
      expand,
      resolved,
      token,
    ]).pipe(
      map<MethodResponse | MethodFault, Array<Image>>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            if (!(data.value instanceof Array)) {
              throw new Error('Expected Array but got something else!');
            }
            return this.rebuildFindResults(data.value) as Array<Image>;
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
    return this.call('find_menu', [
      criteria as XmlRpcStruct,
      expand,
      resolved,
      token,
    ]).pipe(
      map<MethodResponse | MethodFault, Array<Menu>>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            if (!(data.value instanceof Array)) {
              throw new Error('Expected Array but got something else!');
            }
            return this.rebuildFindResults(data.value) as Array<Menu>;
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
    return this.call('find_template', [
      criteria as XmlRpcStruct,
      expand,
      resolved,
      token,
    ]).pipe(
      map<MethodResponse | MethodFault, Array<any>>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            if (!(data.value instanceof Array)) {
              throw new Error('Expected Array but got something else!');
            }
            return this.rebuildFindResults(data.value);
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
    return this.call('find_network_interface', [
      criteria as XmlRpcStruct,
      expand,
      resolved,
      token,
    ]).pipe(
      map<MethodResponse | MethodFault, Array<NetworkInterface>>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            if (!(data.value instanceof Array)) {
              throw new Error('Expected Array but got something else!');
            }
            return this.rebuildFindResults(
              data.value,
            ) as Array<NetworkInterface>;
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

  get_distro_group(
    objectId: string,
    flatten: boolean = false,
    resolved: boolean = false,
    token: string,
  ): Observable<DistroGroup> {
    return this.call('get_distro_group', [
      objectId,
      flatten,
      resolved,
      token,
    ]).pipe(
      map<MethodResponse | MethodFault, DistroGroup>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            if (!(data.value instanceof Map)) {
              throw new Error('Expected Map not something else!');
            }
            const result = this.rebuildItem(data.value);
            return result as DistroGroup;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Getting the requested distro group failed with code "' +
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

  get_distro_groups(): Observable<Array<DistroGroup>> {
    return this.call('get_distro_groups').pipe(
      map<MethodResponse | MethodFault, Array<DistroGroup>>(
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
            return result as Array<DistroGroup>;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Getting all distro groups failed with code "' +
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

  find_distro_group(
    criteria: object,
    expand = false,
    resolved = false,
    token: string,
  ): Observable<Array<DistroGroup>> {
    return this.call('find_distro_group', [
      criteria as XmlRpcStruct,
      expand,
      resolved,
      token,
    ]).pipe(
      map<MethodResponse | MethodFault, Array<DistroGroup>>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            if (!(data.value instanceof Array)) {
              throw new Error('Expected Array but got something else!');
            }
            return this.rebuildFindResults(data.value) as Array<DistroGroup>;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Finding the requested distro groups failed with code "' +
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

  get_profile_group(
    objectId: string,
    flatten: boolean = false,
    resolved: boolean = false,
    token: string,
  ): Observable<ProfileGroup> {
    return this.call('get_profile_group', [
      objectId,
      flatten,
      resolved,
      token,
    ]).pipe(
      map<MethodResponse | MethodFault, ProfileGroup>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            if (!(data.value instanceof Map)) {
              throw new Error('Expected Map not something else!');
            }
            const result = this.rebuildItem(data.value);
            return result as ProfileGroup;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Getting the requested profile group failed with code "' +
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

  get_profile_groups(): Observable<Array<ProfileGroup>> {
    return this.call('get_profile_groups').pipe(
      map<MethodResponse | MethodFault, Array<ProfileGroup>>(
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
            return result as Array<ProfileGroup>;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Getting all profile groups failed with code "' +
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

  find_profile_group(
    criteria: object,
    expand = false,
    resolved = false,
    token: string,
  ): Observable<Array<ProfileGroup>> {
    return this.call('find_profile_group', [
      criteria as XmlRpcStruct,
      expand,
      resolved,
      token,
    ]).pipe(
      map<MethodResponse | MethodFault, Array<ProfileGroup>>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            if (!(data.value instanceof Array)) {
              throw new Error('Expected Array but got something else!');
            }
            return this.rebuildFindResults(data.value) as Array<ProfileGroup>;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Finding the requested profile groups failed with code "' +
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

  get_system_group(
    objectId: string,
    flatten: boolean = false,
    resolved: boolean = false,
    token: string,
  ): Observable<SystemGroup> {
    return this.call('get_system_group', [
      objectId,
      flatten,
      resolved,
      token,
    ]).pipe(
      map<MethodResponse | MethodFault, SystemGroup>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            if (!(data.value instanceof Map)) {
              throw new Error('Expected Map not something else!');
            }
            const result = this.rebuildItem(data.value);
            return result as SystemGroup;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Getting the requested system group failed with code "' +
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

  get_system_groups(): Observable<Array<SystemGroup>> {
    return this.call('get_system_groups').pipe(
      map<MethodResponse | MethodFault, Array<SystemGroup>>(
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
            return result as Array<SystemGroup>;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Getting all system groups failed with code "' +
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

  find_system_group(
    criteria: object,
    expand = false,
    resolved = false,
    token: string,
  ): Observable<Array<SystemGroup>> {
    return this.call('find_system_group', [
      criteria as XmlRpcStruct,
      expand,
      resolved,
      token,
    ]).pipe(
      map<MethodResponse | MethodFault, Array<SystemGroup>>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            if (!(data.value instanceof Array)) {
              throw new Error('Expected Array but got something else!');
            }
            return this.rebuildFindResults(data.value) as Array<SystemGroup>;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Finding the requested system groups failed with code "' +
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
    return this.call('find_items_paged', [
      what,
      criteria as XmlRpcStruct,
      sortFields,
      page,
      itemsPerPage,
      token,
    ]).pipe(
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
    return this.call('has_item', [what, name, token]).pipe(
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
    return this.call('get_item_handle', [what, name, token]).pipe(
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
    return this.call('get_distro_handle', [name]).pipe(
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
    return this.call('get_profile_handle', [name]).pipe(
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
    return this.call('get_system_handle', [name]).pipe(
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
    return this.call('get_repo_handle', [name]).pipe(
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
    return this.call('get_image_handle', [name]).pipe(
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
    return this.call('get_menu_handle', [name]).pipe(
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
    return this.call('get_network_interface_handle', [name]).pipe(
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
    return this.call('get_template_handle', [name]).pipe(
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
    return this.call('get_distro_group_handle', [name]).pipe(
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
    return this.call('get_profile_group_handle', [name]).pipe(
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
    return this.call('get_system_group_handle', [name]).pipe(
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
    objectId: string,
    token: string,
    recursive = true,
  ): Observable<boolean> {
    return this.call('remove_item', [what, objectId, token, recursive]).pipe(
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
    objectId: string,
    token: string,
    recursive = true,
  ): Observable<boolean> {
    return this.call('remove_distro', [objectId, token, recursive]).pipe(
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
    objectId: string,
    token: string,
    recursive = true,
  ): Observable<boolean> {
    return this.call('remove_profile', [objectId, token, recursive]).pipe(
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
    objectId: string,
    token: string,
    recursive = true,
  ): Observable<boolean> {
    return this.call('remove_system', [objectId, token, recursive]).pipe(
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
    objectId: string,
    token: string,
    recursive = true,
  ): Observable<boolean> {
    return this.call('remove_repo', [objectId, token, recursive]).pipe(
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
    objectId: string,
    token: string,
    recursive = true,
  ): Observable<boolean> {
    return this.call('remove_image', [objectId, token, recursive]).pipe(
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
    objectId: string,
    token: string,
    recursive = true,
  ): Observable<boolean> {
    return this.call('remove_menu', [objectId, token, recursive]).pipe(
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
    objectId: string,
    token: string,
    recursive = true,
  ): Observable<boolean> {
    return this.call('remove_template', [objectId, token, recursive]).pipe(
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
    objectId: string,
    token: string,
    recursive = true,
  ): Observable<boolean> {
    return this.call('remove_network_interface', [
      objectId,
      token,
      recursive,
    ]).pipe(
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
    objectId: string,
    token: string,
    recursive = true,
  ): Observable<boolean> {
    return this.call('remove_distro_group', [objectId, token, recursive]).pipe(
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
    objectId: string,
    token: string,
    recursive = true,
  ): Observable<boolean> {
    return this.call('remove_profile_group', [objectId, token, recursive]).pipe(
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
    objectId: string,
    token: string,
    recursive = true,
  ): Observable<boolean> {
    return this.call('remove_system_group', [objectId, token, recursive]).pipe(
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
    return this.call('copy_item', [what, objectId, newName, token]).pipe(
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
    return this.call('copy_distro', [objectId, newName, token]).pipe(
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
    return this.call('copy_profile', [objectId, newName, token]).pipe(
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
    return this.call('copy_system', [objectId, newName, token]).pipe(
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
    return this.call('copy_repo', [objectId, newName, token]).pipe(
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
    return this.call('copy_image', [objectId, newName, token]).pipe(
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
    return this.call('copy_menu', [objectId, newName, token]).pipe(
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
    return this.call('copy_network_interface', [objectId, newName, token]).pipe(
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
    return this.call('copy_template', [objectId, newName, token]).pipe(
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
    return this.call('copy_distro_group', [objectId, newName, token]).pipe(
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
    return this.call('copy_profile_group', [objectId, newName, token]).pipe(
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
    return this.call('copy_system_group', [objectId, newName, token]).pipe(
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
    return this.call('rename_item', [what, objectId, newName, token]).pipe(
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
    return this.call('rename_distro', [objectId, newName, token]).pipe(
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
    return this.call('rename_profile', [objectId, newName, token]).pipe(
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
    return this.call('rename_system', [objectId, newName, token]).pipe(
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
    return this.call('rename_repo', [objectId, newName, token]).pipe(
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
    return this.call('rename_image', [objectId, newName, token]).pipe(
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
    return this.call('rename_menu', [objectId, newName, token]).pipe(
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
    return this.call('rename_network_interface', [
      objectId,
      newName,
      token,
    ]).pipe(
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
    return this.call('rename_template', [objectId, newName, token]).pipe(
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
    return this.call('rename_distro_group', [objectId, newName, token]).pipe(
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
    return this.call('rename_profile_group', [objectId, newName, token]).pipe(
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
    return this.call('rename_system_group', [objectId, newName, token]).pipe(
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
    return this.call('new_item', [what, token, isSubobject]).pipe(
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
    return this.call('new_distro', [token]).pipe(
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
    return this.call('new_profile', [token]).pipe(
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
    return this.call('new_subprofile', [token]).pipe(
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
    return this.call('new_system', [token]).pipe(
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
    return this.call('new_repo', [token]).pipe(
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
    return this.call('new_image', [token]).pipe(
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
    return this.call('new_menu', [token]).pipe(
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
    return this.call('new_network_interface', [systemUid, token]).pipe(
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
    return this.call('new_template', [token]).pipe(
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
    return this.call('new_distro_group', [token]).pipe(
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
    return this.call('new_profile_group', [token]).pipe(
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
    return this.call('new_system_group', [token]).pipe(
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
    return this.call('modify_item', [
      what,
      objectId,
      attribute,
      arg as unknown as XmlRpcStruct,
      token,
    ]).pipe(
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
    return this.call('modify_distro', [objectId, attribute, arg, token]).pipe(
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
    return this.call('modify_profile', [objectId, attribute, arg, token]).pipe(
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
    return this.call('modify_system', [objectId, attribute, arg, token]).pipe(
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
    return this.call('modify_image', [objectId, attribute, arg, token]).pipe(
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
    return this.call('modify_repo', [objectId, attribute, arg, token]).pipe(
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
    return this.call('modify_menu', [objectId, attribute, arg, token]).pipe(
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
    return this.call('modify_network_interface', [
      objectId,
      attribute,
      arg,
      token,
    ]).pipe(
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
    return this.call('modify_template', [objectId, attribute, arg, token]).pipe(
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
    return this.call('modify_distro_group', [
      objectId,
      attribute,
      arg,
      token,
    ]).pipe(
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
    return this.call('modify_profile_group', [
      objectId,
      attribute,
      arg,
      token,
    ]).pipe(
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
    return this.call('modify_system_group', [
      objectId,
      attribute,
      arg,
      token,
    ]).pipe(
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
    return this.call('modify_setting', [
      name,
      value as unknown as XmlRpcStruct,
      token,
    ]).pipe(
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
    return this.call('auto_add_repos', [token]).pipe(
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
    return this.call('save_item', [
      what,
      objectId,
      withTriggers,
      withSync,
      editMode,
      token,
    ]).pipe(
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
    return this.call('save_distro', [
      objectId,
      withTriggers,
      withSync,
      editMode,
      token,
    ]).pipe(
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
    return this.call('save_profile', [
      objectId,
      withTriggers,
      withSync,
      editMode,
      token,
    ]).pipe(
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
    return this.call('save_system', [
      objectId,
      withTriggers,
      withSync,
      editMode,
      token,
    ]).pipe(
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
    return this.call('save_image', [
      objectId,
      withTriggers,
      withSync,
      editMode,
      token,
    ]).pipe(
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
    return this.call('save_repo', [
      objectId,
      withTriggers,
      withSync,
      editMode,
      token,
    ]).pipe(
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
    return this.call('save_menu', [
      objectId,
      withTriggers,
      withSync,
      editMode,
      token,
    ]).pipe(
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
    return this.call('save_network_interface', [
      objectId,
      withTriggers,
      withSync,
      editMode,
      token,
    ]).pipe(
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
    return this.call('save_template', [
      objectId,
      withTriggers,
      withSync,
      editMode,
      token,
    ]).pipe(
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
    return this.call('save_distro_group', [
      objectId,
      withTriggers,
      withSync,
      editMode,
      token,
    ]).pipe(
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
    return this.call('save_profile_group', [
      objectId,
      withTriggers,
      withSync,
      editMode,
      token,
    ]).pipe(
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
    return this.call('save_system_group', [
      objectId,
      withTriggers,
      withSync,
      editMode,
      token,
    ]).pipe(
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
    return this.call('is_autoinstall_in_use', [ai, token]).pipe(
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
    return this.call('generate_autoinstall', [
      objIdentifier,
      objType,
      objField,
      autoinstallerFile,
      autoinstallerSubfile,
    ]).pipe(
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
    return this.call('generate_ipxe', [
      profile,
      image,
      system,
      rest as XmlRpcStruct,
    ]).pipe(
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
    return this.call('generate_bootcfg', [profile, system]).pipe(
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
    return this.call('generate_script', [profile, system, scriptName]).pipe(
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
    return this.call('dump_vars', [
      itemUuid,
      formattedOutput,
      removeDicts,
    ]).pipe(
      map((data: MethodResponse | MethodFault) => {
        if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
          if (formattedOutput === true) {
            return data.value as string;
          }
          return this.convertXmlRpcValue(data.value) as Record<string, any>;
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
    return this.call('get_blended_data', [profile, system]).pipe(
      map<MethodResponse | MethodFault, any>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return this.convertXmlRpcValue(data.value);
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

  /**
   * Recursively normalizes a single value produced by the ``typescript-xmlrpc`` deserializer.
   *
   * The deserializer maps an XML-RPC ``<struct>`` onto a native ``Map`` and an XML-RPC ``<array>`` onto a native
   * ``Array``. Consumers of this library expect plain objects, so every ``Map`` - no matter how deeply nested - is
   * turned into a plain object and every ``Array`` is walked so that structs nested inside arrays are converted as
   * well. All other values (strings, numbers, booleans, ``Date``, ``ArrayBuffer``, ``null``) are passed through
   * untouched.
   *
   * @param value The value to normalize.
   * @returns The normalized value.
   */
  private convertXmlRpcValue(value: any): any {
    if (value instanceof Map) {
      return this.convertXmlRpcStructToTypeScriptObject(value);
    }
    if (Array.isArray(value)) {
      return this.convertXmlRpcArrayToTypeScriptArray(value);
    }
    if (value === '&lt;&lt;inherit&gt;&gt;') {
      // Defensive: the deserializer decodes XML entities already, so this normally never matches.
      // FIXME: Maybe we need to XML encode this as other strings potentially also could need encoding
      return '<<inherit>>';
    }
    return value;
  }

  /**
   * Converts a deserialized XML-RPC ``<struct>`` (a native ``Map``) into a plain object, recursively converting all of
   * its values.
   *
   * @param inputStruct The deserialized struct.
   * @returns The equivalent plain object.
   */
  private convertXmlRpcStructToTypeScriptObject(
    inputStruct: Map<string, any>,
  ): Record<string, any> {
    const result_object: Record<string, any> = {};
    inputStruct.forEach((value, key) => {
      CobblerApiService.assignStructMember(
        result_object,
        key,
        this.convertXmlRpcValue(value),
      );
    });
    return result_object;
  }

  /**
   * Member names of an XML-RPC ``<struct>`` are chosen by the Cobbler administrator for the free-form dictionaries
   * (``kernel_options``, ``autoinstall_meta``, ``template_files``, ...), so they may collide with the special
   * ``Object.prototype`` property names. A plain ``target[key] = value`` assignment would then not create an own
   * property: ``__proto__`` is an accessor on ``Object.prototype`` and its setter would mutate the prototype chain
   * instead (a prototype-pollution gadget) while the member silently disappears from the result.
   *
   * Therefore such keys are installed with {@link Object.defineProperty}, which always creates a plain own property
   * and never consults the prototype chain. Regular keys keep the cheap assignment.
   *
   * @param target The object under construction.
   * @param key The struct member name.
   * @param value The already normalized struct member value.
   */
  private static assignStructMember(
    target: Record<string, any>,
    key: string,
    value: any,
  ): void {
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      Object.defineProperty(target, key, {
        value: value,
        enumerable: true,
        writable: true,
        configurable: true,
      });
      return;
    }
    target[key] = value;
  }

  /**
   * Converts a deserialized XML-RPC ``<array>`` into a new array whose elements are recursively converted. This is
   * what turns an array of structs into an array of plain objects.
   *
   * @param inputArray The deserialized array.
   * @returns The equivalent array with normalized elements.
   */
  private convertXmlRpcArrayToTypeScriptArray(
    inputArray: Array<any>,
  ): Array<any> {
    return inputArray.map((value) => this.convertXmlRpcValue(value));
  }

  /**
   * Recursively prepares a value for the ``typescript-xmlrpc`` serializer. This is the outbound-direction mirror of
   * {@link convertXmlRpcValue}.
   *
   * ``serializeValue()`` only accepts a native ``Map`` or the ``{members: [...]}`` / ``{data: [...]}`` marker objects
   * as a ``<struct>`` / ``<array>``; a plain object literal makes it throw
   * ``Type of value node could not be detected!``. Since {@link convertXmlRpcValue} hands plain objects to the
   * consumers of this library, those very same plain objects come back as arguments of ``find_*``, ``modify_*`` and
   * ``save_*`` calls, so they have to be turned back into something the serializer understands. A ``Map`` is used for
   * that because - unlike the marker objects - it can never be confused with user supplied data.
   *
   * The conversion rules are:
   *
   * - ``null``, ``undefined`` and every primitive are passed through untouched.
   * - A ``Map`` is rebuilt with recursively converted values (it is already a valid struct, but its values may not
   *   be).
   * - An ``Array`` is rebuilt with recursively converted elements.
   * - ``Date``, ``ArrayBuffer`` and typed arrays / ``DataView`` are passed through untouched. Typed arrays are not
   *   turned into a struct of numeric indices on purpose: the serializer rejecting them loudly is far better than
   *   silently sending corrupted binary data.
   * - A hand-built {@link XmlRpcStruct} (``{members: [{name, value}, ...]}``) keeps its shape - a lot of the methods
   *   in this class build one - but its member values are converted recursively.
   * - Every other object becomes a ``Map`` whose values are converted recursively.
   *
   * @param value The value to prepare.
   * @returns A value that the serializer of ``typescript-xmlrpc`` accepts.
   */
  private toXmlRpcValue(value: any): any {
    if (value === null || typeof value !== 'object') {
      return value;
    }
    if (value instanceof Map) {
      const convertedMap = new Map<any, any>();
      value.forEach((mapValue, mapKey) => {
        convertedMap.set(mapKey, this.toXmlRpcValue(mapValue));
      });
      return convertedMap;
    }
    if (Array.isArray(value)) {
      return value.map((element) => this.toXmlRpcValue(element));
    }
    if (Object.prototype.toString.call(value) === '[object Date]') {
      // Why don't we use instanceof for Date? - https://stackoverflow.com/a/643827/4730773
      return value;
    }
    if (value instanceof ArrayBuffer || ArrayBuffer.isView(value)) {
      return value;
    }
    if (CobblerApiService.isXmlRpcStructMarker(value)) {
      return {
        members: (value as XmlRpcStruct).members.map((member) => ({
          name: member.name,
          value: this.toXmlRpcValue(member.value),
        })),
      } as XmlRpcStruct;
    }
    const convertedStruct = new Map<string, any>();
    for (const key of Object.keys(value)) {
      convertedStruct.set(key, this.toXmlRpcValue(value[key]));
    }
    return convertedStruct;
  }

  /**
   * Detects a hand-built {@link XmlRpcStruct} marker object.
   *
   * ``Utils.instanceOfXmlRpcStruct()`` of ``typescript-xmlrpc`` only checks that the object has exactly one key named
   * ``members``, which a free-form Cobbler dictionary (``kernel_options``, ``autoinstall_meta``, ...) could match by
   * accident. The shape is therefore validated here as well, so that only a genuine marker keeps its special
   * treatment and everything else is safely serialized as a struct.
   *
   * The sibling ``{data: [...]}`` ({@link XmlRpcArray}) marker is deliberately NOT recognized, because a Cobbler
   * dictionary with a single key named ``data`` is entirely plausible and would then be silently serialized as an
   * ``<array>`` instead of a ``<struct>``. A plain ``Array`` expresses the same thing unambiguously, which is why
   * ``background_syncsystems()``, ``background_reposync()`` and ``background_power_system()`` hand their list member
   * to the serializer as a plain ``Array`` instead of wrapping it into that marker.
   *
   * @param value The object to inspect.
   * @returns Whether the object is an {@link XmlRpcStruct}.
   */
  private static isXmlRpcStructMarker(value: object): boolean {
    if (Object.keys(value).length !== 1 || !('members' in value)) {
      return false;
    }
    const members = (value as XmlRpcStruct).members;
    return (
      Array.isArray(members) &&
      members.every(
        (member) =>
          member !== null &&
          typeof member === 'object' &&
          'name' in member &&
          'value' in member,
      )
    );
  }

  /**
   * Performs an XML-RPC method call after running every parameter through {@link toXmlRpcValue}.
   *
   * Every method of this class must go through this wrapper instead of calling
   * {@link AngularXmlrpcService.methodCall} directly, so that no call site can accidentally hand a plain object to the
   * serializer.
   *
   * @param method The name of the XML-RPC method.
   * @param params The parameters of the call, in any shape that {@link toXmlRpcValue} understands.
   * @param encoding The encoding that is added to the generated XML document.
   * @returns The observable of the (deserialized) server response.
   */
  private call(
    method: string,
    params?: Array<any>,
    encoding?: string,
  ): Observable<MethodResponse | MethodFault> {
    return this.client.methodCall(
      method,
      params === undefined
        ? undefined
        : params.map((param) => this.toXmlRpcValue(param)),
      encoding,
    );
  }

  get_settings(token: string, rest?: RestValue): Observable<Settings> {
    return this.call('get_settings', [token]).pipe(
      map<MethodResponse | MethodFault, Settings>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            if (data.value instanceof Map) {
              return this.convertXmlRpcStructToTypeScriptObject(
                data.value,
              ) as Settings;
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
    return this.call('get_signatures', [token]).pipe(
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
              CobblerApiService.assignStructMember(
                result.breeds,
                osBreedName,
                {},
              );
              osVersionStruct.forEach((osVersionValueStruct, osVersionName) => {
                if (!(osVersionValueStruct instanceof Map)) {
                  throw new Error(
                    'Expected to receive Map for osVersionValueStruct!',
                  );
                }
                CobblerApiService.assignStructMember(
                  result.breeds[osBreedName],
                  osVersionName,
                  {},
                );
                osVersionValueStruct.forEach(
                  (attributeValue, attributeName) => {
                    CobblerApiService.assignStructMember(
                      result.breeds[osBreedName][osVersionName],
                      attributeName,
                      attributeValue,
                    );
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
    return this.call('get_valid_breeds', [token]).pipe(
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
    return this.call('get_valid_os_versions_for_breed', [breed, token]).pipe(
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
    return this.call('get_valid_os_versions', [token]).pipe(
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
    return this.call('get_valid_archs', [token]).pipe(
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
    return this.call('get_valid_distro_boot_loaders', [distroName, token]).pipe(
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
    return this.call('get_valid_profile_boot_loaders', [
      profileName,
      token,
    ]).pipe(
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
    return this.call('get_valid_image_boot_loaders', [imageName, token]).pipe(
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
    return this.call('get_valid_system_boot_loaders', [systemName, token]).pipe(
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
    return this.call('get_repo_config_for_profile', [profileName]).pipe(
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
    return this.call('get_repo_config_for_system', [systemName]).pipe(
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
    return this.call('get_template_file_for_profile', [profileName, path]).pipe(
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
    return this.call('get_template_file_for_system', [systemName, path]).pipe(
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

  get_template_content(
    uid: string,
    token: string,
    rest?: RestValue,
  ): Observable<string> {
    return this.call('get_template_content', [uid, token]).pipe(
      map<MethodResponse | MethodFault, string>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as string;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error(
              'Getting the content of the requested template failed with code "' +
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
    return this.call('register_new_system', [transformedOptions, token]).pipe(
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
    return this.call('disable_netboot', [name, token]).pipe(
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
    return this.call('upload_log_data', [
      sysName,
      file,
      size,
      offset,
      data,
      token,
    ]).pipe(
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
    return this.call('run_install_triggers', [
      mode,
      objType,
      name,
      ip,
      token,
    ]).pipe(
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
    return this.call('version').pipe(
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
    return this.call('extended_version').pipe(
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
    return this.call('get_distros_since', [mtime]).pipe(
      map<MethodResponse | MethodFault, ResolvedValue>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return this.convertXmlRpcValue(data.value) as ResolvedValue;
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
    return this.call('get_profiles_since', [mtime]).pipe(
      map<MethodResponse | MethodFault, ResolvedValue>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return this.convertXmlRpcValue(data.value) as ResolvedValue;
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
    return this.call('get_systems_since', [mtime]).pipe(
      map<MethodResponse | MethodFault, ResolvedValue>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return this.convertXmlRpcValue(data.value) as ResolvedValue;
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
    return this.call('get_repos_since', [mtime]).pipe(
      map<MethodResponse | MethodFault, ResolvedValue>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return this.convertXmlRpcValue(data.value) as ResolvedValue;
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
    return this.call('get_images_since', [mtime]).pipe(
      map<MethodResponse | MethodFault, ResolvedValue>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return this.convertXmlRpcValue(data.value) as ResolvedValue;
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
    return this.call('get_menus_since', [mtime]).pipe(
      map<MethodResponse | MethodFault, ResolvedValue>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return this.convertXmlRpcValue(data.value) as ResolvedValue;
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
    return this.call('get_network_interfaces_since', [mtime]).pipe(
      map<MethodResponse | MethodFault, ResolvedValue>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return this.convertXmlRpcValue(data.value) as ResolvedValue;
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
    return this.call('get_templates_since', [mtime]).pipe(
      map<MethodResponse | MethodFault, ResolvedValue>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return this.convertXmlRpcValue(data.value) as ResolvedValue;
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
    return this.call('get_distro_groups_since', [mtime]).pipe(
      map<MethodResponse | MethodFault, ResolvedValue>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return this.convertXmlRpcValue(data.value) as ResolvedValue;
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
    return this.call('get_profile_groups_since', [mtime]).pipe(
      map<MethodResponse | MethodFault, ResolvedValue>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return this.convertXmlRpcValue(data.value) as ResolvedValue;
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
    return this.call('get_system_groups_since', [mtime]).pipe(
      map<MethodResponse | MethodFault, ResolvedValue>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return this.convertXmlRpcValue(data.value) as ResolvedValue;
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
    return this.call('get_repos_compatible_with_profile', [
      profile,
      token,
    ]).pipe(
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
    return this.call('find_system_by_dns_name', [dnsName]).pipe(
      map<MethodResponse | MethodFault, Record<string, any>>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return this.convertXmlRpcValue(data.value) as Record<string, any>;
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
    return this.call('get_distro_as_rendered', [name, token]).pipe(
      map<MethodResponse | MethodFault, ResolvedValue>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return this.convertXmlRpcValue(data.value) as ResolvedValue;
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
    return this.call('get_profile_as_rendered', [name, token]).pipe(
      map<MethodResponse | MethodFault, ResolvedValue>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return this.convertXmlRpcValue(data.value) as ResolvedValue;
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
    return this.call('get_system_as_rendered', [name, token]).pipe(
      map<MethodResponse | MethodFault, ResolvedValue>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return this.convertXmlRpcValue(data.value) as ResolvedValue;
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
    return this.call('get_repo_as_rendered', [name, token]).pipe(
      map<MethodResponse | MethodFault, ResolvedValue>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return this.convertXmlRpcValue(data.value) as ResolvedValue;
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
    return this.call('get_image_as_rendered', [name, token]).pipe(
      map<MethodResponse | MethodFault, ResolvedValue>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return this.convertXmlRpcValue(data.value) as ResolvedValue;
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
    return this.call('get_menu_as_rendered', [name, token]).pipe(
      map<MethodResponse | MethodFault, ResolvedValue>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return this.convertXmlRpcValue(data.value) as ResolvedValue;
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
    return this.call('get_distro_group_as_rendered', [name, token]).pipe(
      map<MethodResponse | MethodFault, ResolvedValue>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return this.convertXmlRpcValue(data.value) as ResolvedValue;
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
    return this.call('get_profile_group_as_rendered', [name, token]).pipe(
      map<MethodResponse | MethodFault, ResolvedValue>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return this.convertXmlRpcValue(data.value) as ResolvedValue;
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
    return this.call('get_system_group_as_rendered', [name, token]).pipe(
      map<MethodResponse | MethodFault, ResolvedValue>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return this.convertXmlRpcValue(data.value) as ResolvedValue;
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
    return this.call('get_random_mac', [virtType, token]).pipe(
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
    return this.call('xmlrpc_hacks', [data as unknown as XmlRpcStruct]).pipe(
      map<MethodResponse | MethodFault, ResolvedValue>(
        (data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return this.convertXmlRpcValue(data.value) as ResolvedValue;
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
    return this.call('get_status', [mode, token]).pipe(
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
    return this.call('check_access_no_fail', [
      token,
      resource,
      arg1,
      arg2,
    ]).pipe(
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
    return this.call('check_access', [token, resource, arg1, arg2]).pipe(
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
    return this.call('get_authn_module_name', [token]).pipe(
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
    return this.call('login', [username, password]).pipe(
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
    return this.call('logout', [token]).pipe(
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
    return this.call('token_check', [token]).pipe(
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
    return this.call('sync_dhcp', [token]).pipe(
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
    return this.call('sync', [token]).pipe(
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
    return this.call('get_config_data', [hostname]).pipe(
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
    return this.call('clear_system_logs', [objectId, token]).pipe(
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
    return this.call('input_string_or_list_no_inherit', [options]).pipe(
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
    return this.call('input_string_or_list', [options]).pipe(
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
    return this.call('input_string_or_dict_no_inherit', [
      options as unknown as XmlRpcStruct,
      allowMultiples,
    ]).pipe(
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
    return this.call('input_string_or_dict', [
      options as unknown as XmlRpcStruct,
      allowMultiples,
    ]).pipe(
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
    return this.call('input_boolean', [value]).pipe(
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
    return this.call('input_int', [value]).pipe(
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
    return this.call('get_tftp_file', [path, offset, size, token]).pipe(
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
    return this.call('transaction_begin', [token]).pipe(
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
    return this.call('transaction_commit', [token]).pipe(
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
    return this.call('transaction_abort', [token]).pipe(
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

import {Injectable, Inject} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {AngularXmlrpcService, MethodResponse, MethodFault, XmlRpcStruct, XmlRpcArray} from 'typescript-xmlrpc';
import {Settings} from './custom-types/settings';
import {COBBLER_URL} from './lib.config';
import {Distro, Image, Mgmgtclass, Package, Profile, Repo, System, File} from './custom-types/items';
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
  Version
} from './custom-types/misc';
import {DistroSignatures} from "./custom-types/signatures";

// TODO: Investigate on server side to build and receive well known interfaces, not just plain objects.

@Injectable({
  providedIn: 'root'
})
export class CobblerApiService {
  private client: AngularXmlrpcService;

  constructor(xmlrpcService: AngularXmlrpcService, @Inject(COBBLER_URL) url: URL) {
    this.client = xmlrpcService;
    this.client.configureService(url);
  }

  reconfigureService(url: URL) {
    this.client.configureService(url);
  }

  check(token: string): Observable<Array<string>> {
    return this.client
      .methodCall('check', [token])
      .pipe(
        map<MethodResponse | MethodFault, XmlRpcArray>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as XmlRpcArray;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Check failed with code "' + data.faultCode + '" and error message "'
              + data.faultString + '"');
          }
        }),
        map<XmlRpcArray, Array<string>>((data: XmlRpcArray) => {
          const result: Array<string> = [];
          data.data.forEach(element => {
            result.push(element as string);
          });
          return result;
        })
      );
  }

  background_buildiso(options: BackgroundBuildisoOptions, token: string): Observable<string> {
    const transformedOptions: XmlRpcStruct = {
      members: [
        {name: 'iso', value: options.iso},
        {name: 'profiles', value: options.profiles},
        {name: 'systems', value: options.systems},
        {name: 'buildisodir', value: options.buildisodir},
        {name: 'distro', value: options.distro},
        {name: 'standalone', value: options.standalone},
        {name: 'airgapped', value: options.airgapped},
        {name: 'source', value: options.source},
        {name: 'excludeDNS', value: options.excludeDNS},
        {name: 'xorrisofsOpts', value: options.xorrisofsOpts},
      ]
    }
    return this.client
      .methodCall('background_buildiso', [transformedOptions, token])
      .pipe(
        map<MethodResponse | MethodFault, string>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as string;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Building the ISO in the background failed with code "' + data.faultCode
              + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  background_aclsetup(options: BackgroundAclSetupOptions, token: string): Observable<string> {
    const transformedOptions: XmlRpcStruct = {
      members: [
        {name: 'adduser', value: options.adduser},
        {name: 'addgroup', value: options.addgroup},
        {name: 'removeuser', value: options.removeuser},
        {name: 'adduser', value: options.adduser},
      ]
    }
    return this.client
      .methodCall('background_aclsetup', [transformedOptions, token])
      .pipe(
        map<MethodResponse | MethodFault, string>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as string;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Applying the ACLs in the background failed with code "' + data.faultCode
              + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  background_sync(options: SyncOptions, token: string): Observable<string> {
    const transformedOptions: XmlRpcStruct = {
      members: [
        {name: 'dhcp', value: options.dhcp},
        {name: 'dns', value: options.dns},
        {name: 'verbose', value: options.verbose},
      ]
    }
    return this.client
      .methodCall('background_sync', [transformedOptions, token])
      .pipe(
        map<MethodResponse | MethodFault, string>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as string;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Executing a sync in the background failed with code "' + data.faultCode
              + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  background_syncsystems(options: SyncSystemsOptions, token: string): Observable<string> {
    const transformedOptions: XmlRpcStruct = {
      members: [
        {name: 'systems', value: {data: options.systems}},
        {name: 'verbose', value: options.verbose},
      ]
    }
    return this.client
      .methodCall('background_syncsystems', [transformedOptions, token])
      .pipe(
        map<MethodResponse | MethodFault, string>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as string;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Syncing the systems in background failed with code "' + data.faultCode
              + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  background_hardlink(token: string): Observable<string> {
    const hardlinkOptions: XmlRpcStruct = {members: []}
    return this.client
      .methodCall('background_hardlink', [hardlinkOptions, token])
      .pipe(
        map<MethodResponse | MethodFault, string>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as string;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Hardlinking files on the server in the background failed with code "' + data.faultCode
              + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  background_validate_autoinstall_files(token: string): Observable<string> {
    return this.client
      .methodCall('background_validate_autoinstall_files', [token])
      .pipe(
        map<MethodResponse | MethodFault, string>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as string;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Validation of auto-installation files in the background failed with code "'
              + data.faultCode + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  background_replicate(options: BackgroundReplicateOptions, token: string): Observable<string> {
    const transformedOptions: XmlRpcStruct = {
      members: [
        {name: 'master', value: options.master},
        {name: 'port', value: options.port},
        {name: 'distro_patterns', value: options.distro_patterns},
        {name: 'profile_patterns', value: options.profile_patterns},
        {name: 'system_patterns', value: options.system_patterns},
        {name: 'repo_patterns', value: options.repo_patterns},
        {name: 'image_patterns', value: options.image_patterns},
        {name: 'mgmtclass_patterns', value: options.mgmtclass_patterns},
        {name: 'package_patterns', value: options.package_patterns},
        {name: 'file_patterns', value: options.file_patterns},
        {name: 'prune', value: options.prune},
        {name: 'omit_data', value: options.omit_data},
        {name: 'sync_all', value: options.sync_all},
        {name: 'use_ssl', value: options.use_ssl},
      ]
    }
    return this.client
      .methodCall('background_replicate', [transformedOptions, token])
      .pipe(
        map<MethodResponse | MethodFault, string>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as string;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Replicating the Cobbler instance in the background failed with code "' + data.faultCode
              + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  background_import(options: BackgroundImportOptions, token: string): Observable<string> {
    const transformedOptions: XmlRpcStruct = {
      members: [
        {name: 'path', value: options.path},
        {name: 'name', value: options.name},
        {name: 'available_as', value: options.available_as},
        {name: 'autoinstall_file', value: options.autoinstall_file},
        {name: 'rsync_flags', value: options.rsync_flags},
        {name: 'arch', value: options.arch},
        {name: 'breed', value: options.breed},
        {name: 'os_version', value: options.os_version},
      ]
    }
    return this.client
      .methodCall('background_import', [transformedOptions, token])
      .pipe(
        map<MethodResponse | MethodFault, string>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as string;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Importing an ISO on the server in the background failed with code "' + data.faultCode
              + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  background_reposync(options: BackgroundReposyncOptions, token: string): Observable<string> {
    const transformedOptions: XmlRpcStruct = {
      members: [
        {name: 'repos', value: {data: options.repos}},
        {name: 'only', value: options.only},
        {name: 'nofail', value: options.nofail},
        {name: 'tries', value: options.tries},
      ]
    }
    return this.client
      .methodCall('background_reposync', [transformedOptions, token])
      .pipe(
        map<MethodResponse | MethodFault, string>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as string;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Executing a reposync in the background failed with code "' + data.faultCode
              + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  background_power_system(options: BackgroundPowerSystem, token: string): Observable<string> {
    const transformedOptions: XmlRpcStruct = {
      members: [
        {name: 'systems', value: {data: options.systems}},
        {name: 'power', value: options.power},
      ]
    }
    return this.client
      .methodCall('background_power_system', [transformedOptions, token])
      .pipe(
        map<MethodResponse | MethodFault, string>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as string;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Executing the power action for a system in the background failed with code "'
              + data.faultCode + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  power_system(systemId: string, power: string, token: string): Observable<boolean> {
    return this.client
      .methodCall('power_system', [systemId, power, token])
      .pipe(
        map<MethodResponse | MethodFault, boolean>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as boolean;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Executing the power action for a system failed with code "' + data.faultCode
              + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  background_signature_update(token: string): Observable<string> {
    const signatureUpdateOptions: XmlRpcStruct = {members: []}
    return this.client
      .methodCall('background_signature_update', [signatureUpdateOptions, token])
      .pipe(
        map<MethodResponse | MethodFault, string>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as string;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Updating the signatures in the background failed with code "' + data.faultCode
              + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  get_events(forUser: string): Observable<Array<Event>> {
    return this.client
      .methodCall('get_events', [forUser])
      .pipe(
        map<MethodResponse | MethodFault, XmlRpcStruct>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as XmlRpcStruct;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Getting the events failed with code "' + data.faultCode + '" and error message "'
              + data.faultString + '"');
          }
        }),
        map<XmlRpcStruct, Array<Event>>((data: XmlRpcStruct) => {
          let result: Array<Event> = [];
          data.members.forEach( element => {
            const membersArray = element.value as XmlRpcArray
            const usersArray = membersArray.data[3] as XmlRpcArray
            result.push({
              id: element.name,
              statetime: membersArray.data[0] as number,
              name: membersArray.data[1] as string,
              state: membersArray.data[2] as string,
              readByWho: usersArray.data as string[]
            })
          })
          return result;
        })
      );
  }

  get_event_log(eventId: string): Observable<string> {
    return this.client
      .methodCall('get_event_log', [eventId])
      .pipe(
        map<MethodResponse | MethodFault, string>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as string;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Getting the event log failed with code "' + data.faultCode + '" and error message "'
              + data.faultString + '"');
          }
        })
      );
  }

  get_task_status(eventId: string): Observable<Event> {
    return this.client
      .methodCall('get_task_status', [eventId])
      .pipe(
        map<MethodResponse | MethodFault, XmlRpcArray>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as XmlRpcArray;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Getting the status of the requested task failed with code "' + data.faultCode
              + '" and error message "' + data.faultString + '"');
          }
        }),
        map<XmlRpcArray, Event>((data: XmlRpcArray) => {
          const readByWho = data.data[3] as XmlRpcArray
          return {
            id: eventId,
            statetime: data.data[0] as number,
            name: data.data[1] as string,
            state: data.data[2] as string,
            readByWho: readByWho.data as string[],
          }
        })
      );
  }

  last_modified_time(): Observable<number> {
    return this.client
      .methodCall('last_modified_time')
      .pipe(
        map<MethodResponse | MethodFault, number>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as number;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Getting the last modified time failed with code "' + data.faultCode
              + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  ping(): Observable<boolean> {
    return this.client
      .methodCall('ping')
      .pipe(
        map<MethodResponse | MethodFault, boolean>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as boolean;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Pinging the server failed with code "' + data.faultCode + '" and error message "'
              + data.faultString + '"');
          }
        })
      );
  }

  get_user_from_token(token: string): Observable<string> {
    return this.client
      .methodCall('get_user_from_token', [token])
      .pipe(
        map<MethodResponse | MethodFault, string>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as string;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Getting the user from the requested token failed with code "' + data.faultCode
              + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  // TODO: Create casting magic to output the right item type
  get_item(what: string, name: string, flatten: boolean = false): Observable<object> {
    return this.client
      .methodCall('get_item', [what, name, flatten])
      .pipe(
        map<MethodResponse | MethodFault, object>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as object;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Getting the requested item failed with code "' + data.faultCode + '" and error message "'
              + data.faultString + '"');
          }
        })
      );
  }

  get_distro(name: string, flatten: boolean = false): Observable<Distro> {
    return this.client
      .methodCall('get_distro', [name, flatten])
      .pipe(
        map<MethodResponse | MethodFault, Distro>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            // FIXME: Make the cast without the unknown possible
            return data.value as unknown as Distro;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Getting the requested distro failed with code "' + data.faultCode + '" and error message "'
              + data.faultString + '"');
          }
        })
      );
  }

  get_profile(name: string, flatten: boolean = false): Observable<Profile> {
    return this.client
      .methodCall('get_profile', [name, flatten])
      .pipe(
        map<MethodResponse | MethodFault, Profile>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            // FIXME: Make the cast without the unknown possible
            return data.value as unknown as Profile;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Getting the requested profile failed with code "' + data.faultCode
              + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  get_system(name: string, flatten: boolean = false): Observable<System> {
    return this.client
      .methodCall('get_system', [name, flatten])
      .pipe(
        map<MethodResponse | MethodFault, System>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            // FIXME: Make the cast without the unknown possible
            return data.value as unknown as System;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Getting the requested system failed with code "' + data.faultCode + '" and error message "'
              + data.faultString + '"');
          }
        })
      );
  }

  get_repo(name: string, flatten: boolean = false): Observable<Repo> {
    return this.client
      .methodCall('get_repo', [name, flatten])
      .pipe(
        map<MethodResponse | MethodFault, Repo>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            // FIXME: Make the cast without the unknown possible
            return data.value as unknown as Repo;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Getting the requested repository failed with code "' + data.faultCode
              + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  get_image(name: string, flatten: boolean = false): Observable<Image> {
    return this.client
      .methodCall('get_repo', [name, flatten])
      .pipe(
        map<MethodResponse | MethodFault, Image>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            // FIXME: Make the cast without the unknown possible
            return data.value as unknown as Image;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Getting the requested image failed with code "' + data.faultCode + '" and error message "'
              + data.faultString + '"');
          }
        })
      );
  }

  get_mgmtclass(name: string, flatten: boolean = false): Observable<Mgmgtclass> {
    return this.client
      .methodCall('get_repo', [name, flatten])
      .pipe(
        map<MethodResponse | MethodFault, Mgmgtclass>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            // FIXME: Make the cast without the unknown possible
            return data.value as unknown as Mgmgtclass;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Getting the requested management class failed with code "' + data.faultCode
              + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  get_package(name: string, flatten: boolean = false): Observable<Package> {
    return this.client
      .methodCall('get_repo', [name, flatten])
      .pipe(
        map<MethodResponse | MethodFault, Package>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            // FIXME: Make the cast without the unknown possible
            return data.value as unknown as Package;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Getting the requested package failed with code "' + data.faultCode
              + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  get_file(name: string, flatten: boolean = false): Observable<File> {
    return this.client
      .methodCall('get_repo', [name, flatten])
      .pipe(
        map<MethodResponse | MethodFault, File>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            // FIXME: Make the cast without the unknown possible
            return data.value as unknown as File;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Getting the requested file failed with code "' + data.faultCode + '" and error message "'
              + data.faultString + '"');
          }
        })
      );
  }

  // TODO: Add endpoint for menu

  get_items(what: string): Observable<Array<object>> {
    // TODO: Add magic for casting to correct Collection
    return this.client
      .methodCall('get_items', [what])
      .pipe(
        map<MethodResponse | MethodFault, Array<object>>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            // FIXME: Make the cast without the unknown possible
            return data.value as unknown as Array<object>;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Getting the requested collection failed with code "' + data.faultCode
              + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  get_item_names(what: string): Observable<Array<string>> {
    return this.client
      .methodCall('get_item_names', [what])
      .pipe(
        map<MethodResponse | MethodFault, Array<string>>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            // FIXME: Make the cast without the unknown possible
            return data.value as unknown as Array<string>;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Getting the item names failed with code "' + data.faultCode + '" and error message "'
              + data.faultString + '"');
          }
        })
      );
  }

  get_distros(): Observable<Array<Distro>> {
    return this.client
      .methodCall('get_distros')
      .pipe(
        map<MethodResponse | MethodFault, Array<Distro>>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            // FIXME: Make the cast without the unknown possible
            return data.value as unknown as Array<Distro>;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Getting all distros failed with code "' + data.faultCode + '" and error message "'
              + data.faultString + '"');
          }
        })
      );
  }

  get_profiles(): Observable<Array<Profile>> {
    return this.client
      .methodCall('get_profiles')
      .pipe(
        map<MethodResponse | MethodFault, Array<Profile>>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            // FIXME: Make the cast without the unknown possible
            return data.value as unknown as Array<Profile>;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Getting all profiles failed with code "' + data.faultCode + '" and error message "'
              + data.faultString + '"');
          }
        })
      );
  }

  get_systems(): Observable<Array<System>> {
    return this.client
      .methodCall('get_systems')
      .pipe(
        map<MethodResponse | MethodFault, Array<System>>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            // FIXME: Make the cast without the unknown possible
            return data.value as unknown as Array<System>;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Getting the systems failed with code "' + data.faultCode + '" and error message "'
              + data.faultString + '"');
          }
        })
      );
  }

  get_repos(): Observable<Array<Repo>> {
    return this.client
      .methodCall('get_repos')
      .pipe(
        map<MethodResponse | MethodFault, Array<Repo>>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            // FIXME: Make the cast without the unknown possible
            return data.value as unknown as Array<Repo>;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Getting the repositories failed with code "' + data.faultCode + '" and error message "'
              + data.faultString + '"');
          }
        })
      );
  }

  get_images(): Observable<Array<Image>> {
    return this.client
      .methodCall('get_images')
      .pipe(
        map<MethodResponse | MethodFault, Array<Image>>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            // FIXME: Make the cast without the unknown possible
            return data.value as unknown as Array<Image>;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Getting the images failed with code "' + data.faultCode + '" and error message "'
              + data.faultString + '"');
          }
        })
      );
  }

  get_mgmtclasses(): Observable<Array<Mgmgtclass>> {
    return this.client
      .methodCall('get_mgmtclasses')
      .pipe(
        map<MethodResponse | MethodFault, Array<Mgmgtclass>>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            // FIXME: Make the cast without the unknown possible
            return data.value as unknown as Array<Mgmgtclass>;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Getting the management classes failed with code "' + data.faultCode
              + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  get_packages(): Observable<Array<Package>> {
    return this.client
      .methodCall('get_packages')
      .pipe(
        map<MethodResponse | MethodFault, Array<Package>>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            // FIXME: Make the cast without the unknown possible
            return data.value as unknown as Array<Package>;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Getting the packages failed with code "' + data.faultCode + '" and error message "'
              + data.faultString + '"');
          }
        })
      );
  }

  get_files(): Observable<Array<File>> {
    return this.client
      .methodCall('get_files')
      .pipe(
        map<MethodResponse | MethodFault, Array<File>>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            // FIXME: Make the cast without the unknown possible
            return data.value as unknown as Array<File>;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Getting the files failed with code "' + data.faultCode + '" and error message "'
              + data.faultString + '"');
          }
        })
      );
  }

  // TODO: Create method for Menus

  find_items(what: string, criteria: object, sortField: string, expand: boolean): Observable<Array<object>> {
    return this.client
      .methodCall('find_items', [what, criteria as XmlRpcStruct, sortField, expand])
      .pipe(
        map<MethodResponse | MethodFault, Array<object>>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            // FIXME: Make the cast without the unknown possible
            return data.value as unknown as Array<object>;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Finding the requested items failed with code "' + data.faultCode + '" and error message "'
              + data.faultString + '"');
          }
        })
      );
  }

  find_distro(criteria: object, expand: boolean): Observable<Array<Distro>> {
    return this.client
      .methodCall('find_distro', [criteria as XmlRpcStruct, expand])
      .pipe(
        map<MethodResponse | MethodFault, Array<Distro>>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            // FIXME: Make the cast without the unknown possible
            return data.value as unknown as Array<Distro>;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Finding the requested distros failed with code "' + data.faultCode
              + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  find_profile(criteria: object, expand: boolean): Observable<Array<Profile>> {
    return this.client
      .methodCall('find_profile', [criteria as XmlRpcStruct, expand])
      .pipe(
        map<MethodResponse | MethodFault, Array<Profile>>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            // FIXME: Make the cast without the unknown possible
            return data.value as unknown as Array<Profile>;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Finding the requested profiles failed with code "' + data.faultCode
              + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  find_system(criteria: object, expand: boolean): Observable<Array<System>> {
    return this.client
      .methodCall('find_system', [criteria as XmlRpcStruct, expand])
      .pipe(
        map<MethodResponse | MethodFault, Array<System>>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            // FIXME: Make the cast without the unknown possible
            return data.value as unknown as Array<System>;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Finding the requested systems failed with code "' + data.faultCode
              + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  find_repo(criteria: object, expand: boolean): Observable<Array<Repo>> {
    return this.client
      .methodCall('find_repo', [criteria as XmlRpcStruct, expand])
      .pipe(
        map<MethodResponse | MethodFault, Array<Repo>>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            // FIXME: Make the cast without the unknown possible
            return data.value as unknown as Array<Repo>;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Finding the requested repos failed with code "' + data.faultCode + '" and error message "'
              + data.faultString + '"');
          }
        })
      );
  }

  find_image(criteria: object, expand: boolean): Observable<Array<Image>> {
    return this.client
      .methodCall('find_image', [criteria as XmlRpcStruct, expand])
      .pipe(
        map<MethodResponse | MethodFault, Array<Image>>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            // FIXME: Make the cast without the unknown possible
            return data.value as unknown as Array<Image>;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Finding the requested images failed with code "' + data.faultCode + '" and error message "'
              + data.faultString + '"');
          }
        })
      );
  }

  find_mgmtclass(criteria: object, expand: boolean): Observable<Array<Mgmgtclass>> {
    return this.client
      .methodCall('find_mgmtclass', [criteria as XmlRpcStruct, expand])
      .pipe(
        map<MethodResponse | MethodFault, Array<Mgmgtclass>>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            // FIXME: Make the cast without the unknown possible
            return data.value as unknown as Array<Mgmgtclass>;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Finding the requested management classes failed with code "' + data.faultCode
              + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  find_package(criteria: object, expand: boolean): Observable<Array<Package>> {
    return this.client
      .methodCall('find_package', [criteria as XmlRpcStruct, expand])
      .pipe(
        map<MethodResponse | MethodFault, Array<Package>>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            // FIXME: Make the cast without the unknown possible
            return data.value as unknown as Array<Package>;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Finding the requested packages failed with code "' + data.faultCode
              + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  find_file(criteria: object, expand: boolean): Observable<Array<File>> {
    return this.client
      .methodCall('find_file', [criteria as XmlRpcStruct, expand])
      .pipe(
        map<MethodResponse | MethodFault, Array<File>>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            // FIXME: Make the cast without the unknown possible
            return data.value as unknown as Array<File>;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Finding the requested files failed with code "' + data.faultCode + '" and error message "'
              + data.faultString + '"');
          }
        })
      );
  }

  // TODO: Create find for menu

  find_items_paged(what: string, criteria: object, sortFields: string, page: number, itemsPerPage: number,
                   token: string): Observable<PagesItemsResult> {
    return this.client
      .methodCall('find_items_paged', [what, criteria as XmlRpcStruct, sortFields, page, itemsPerPage, token])
      .pipe(
        map<MethodResponse | MethodFault, PagesItemsResult>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            // FIXME: Make the cast without the unknown possible
            return data.value as unknown as PagesItemsResult;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Finding the requested items (paged) failed with code "' + data.faultCode
              + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  has_item(what: string, name: string, token: string): Observable<boolean> {
    return this.client
      .methodCall('has_item', [what, name, token])
      .pipe(
        map<MethodResponse | MethodFault, boolean>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as boolean;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Checking if the item exists failed with code "' + data.faultCode + '" and error message "'
              + data.faultString + '"');
          }
        })
      );
  }

  get_item_handle(what: string, name: string, token: string): Observable<string> {
    return this.client
      .methodCall('get_item_handle', [what, name, token])
      .pipe(
        map<MethodResponse | MethodFault, string>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as string;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Getting the item handle failed with code "' + data.faultCode + '" and error message "'
              + data.faultString + '"');
          }
        })
      );
  }

  get_distro_handle(name: string, token: string): Observable<string> {
    return this.client
      .methodCall('get_distro_handle', [name, token])
      .pipe(
        map<MethodResponse | MethodFault, string>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as string;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Getting the distro handle failed with code "' + data.faultCode + '" and error message "'
              + data.faultString + '"');
          }
        })
      );
  }

  get_profile_handle(name: string, token: string): Observable<string> {
    return this.client
      .methodCall('get_profile_handle', [name, token])
      .pipe(
        map<MethodResponse | MethodFault, string>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as string;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Getting the profile handle failed with code "' + data.faultCode + '" and error message "'
              + data.faultString + '"');
          }
        })
      );
  }

  get_system_handle(name: string, token: string): Observable<string> {
    return this.client
      .methodCall('get_system_handle', [name, token])
      .pipe(
        map<MethodResponse | MethodFault, string>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as string;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Getting the system handle failed with code "' + data.faultCode + '" and error message "'
              + data.faultString + '"');
          }
        })
      );
  }

  get_repo_handle(name: string, token: string): Observable<string> {
    return this.client
      .methodCall('get_repo_handle', [name, token])
      .pipe(
        map<MethodResponse | MethodFault, string>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as string;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Getting the repository handle failed with code "' + data.faultCode
              + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  get_image_handle(name: string, token: string): Observable<string> {
    return this.client
      .methodCall('get_image_handle', [name, token])
      .pipe(
        map<MethodResponse | MethodFault, string>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as string;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Getting the image handle failed with code "' + data.faultCode + '" and error message "'
              + data.faultString + '"');
          }
        })
      );
  }

  get_mgmtclass_handle(name: string, token: string): Observable<string> {
    return this.client
      .methodCall('get_mgmtclass_handle', [name, token])
      .pipe(
        map<MethodResponse | MethodFault, string>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as string;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Getting the management class handle failed with code "' + data.faultCode
              + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  get_package_handle(name: string, token: string): Observable<string> {
    return this.client
      .methodCall('get_package_handle', [name, token])
      .pipe(
        map<MethodResponse | MethodFault, string>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as string;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Getting the package handle failed with code "' + data.faultCode + '" and error message "'
              + data.faultString + '"');
          }
        })
      );
  }

  get_file_handle(name: string, token: string): Observable<string> {
    return this.client
      .methodCall('get_file_handle', [name, token])
      .pipe(
        map<MethodResponse | MethodFault, string>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as string;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Getting the file handle failed with code "' + data.faultCode + '" and error message "'
              + data.faultString + '"');
          }
        })
      );
  }

  remove_item(what: string, name: string, token: string, recursive = true): Observable<boolean> {
    return this.client
      .methodCall('remove_item', [what, name, token, recursive])
      .pipe(
        map<MethodResponse | MethodFault, boolean>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as boolean;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Removing the requested item failed with code "' + data.faultCode + '" and error message "'
              + data.faultString + '"');
          }
        })
      );
  }

  remove_distro(name: string, token: string, recursive = true): Observable<boolean> {
    return this.client
      .methodCall('remove_distro', [name, token, recursive])
      .pipe(
        map<MethodResponse | MethodFault, boolean>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as boolean;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Removing the requested distro failed with code "' + data.faultCode
              + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  remove_profile(name: string, token: string, recursive = true): Observable<boolean> {
    return this.client
      .methodCall('remove_profile', [name, token, recursive])
      .pipe(
        map<MethodResponse | MethodFault, boolean>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as boolean;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Removing the requested profile failed with code "' + data.faultCode
              + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  remove_system(name: string, token: string, recursive = true): Observable<boolean> {
    return this.client
      .methodCall('remove_system', [name, token, recursive])
      .pipe(
        map<MethodResponse | MethodFault, boolean>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as boolean;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Removing the requested system failed with code "' + data.faultCode
              + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  remove_repo(name: string, token: string, recursive = true): Observable<boolean> {
    return this.client
      .methodCall('remove_repo', [name, token, recursive])
      .pipe(
        map<MethodResponse | MethodFault, boolean>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as boolean;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Removing the requested repo failed with code "' + data.faultCode + '" and error message "'
              + data.faultString + '"');
          }
        })
      );
  }

  remove_image(name: string, token: string, recursive = true): Observable<boolean> {
    return this.client
      .methodCall('remove_image', [name, token, recursive])
      .pipe(
        map<MethodResponse | MethodFault, boolean>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as boolean;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Removing the requested image failed with code "' + data.faultCode + '" and error message "'
              + data.faultString + '"');
          }
        })
      );
  }

  remove_mgmtclass(name: string, token: string, recursive = true): Observable<boolean> {
    return this.client
      .methodCall('remove_mgmtclass', [name, token, recursive])
      .pipe(
        map<MethodResponse | MethodFault, boolean>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as boolean;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Removing the requested management class failed with code "' + data.faultCode
              + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  remove_package(name: string, token: string, recursive = true): Observable<boolean> {
    return this.client
      .methodCall('remove_package', [name, token, recursive])
      .pipe(
        map<MethodResponse | MethodFault, boolean>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as boolean;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Removing the requested package failed with code "' + data.faultCode
              + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  remove_file(name: string, token: string, recursive = true): Observable<boolean> {
    return this.client
      .methodCall('remove_file', [name, token, recursive])
      .pipe(
        map<MethodResponse | MethodFault, boolean>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as boolean;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Removing the requested file failed with code "' + data.faultCode + '" and error message "'
              + data.faultString + '"');
          }
        })
      );
  }

  copy_item(what: string, objectId: string, newName: string, token: string): Observable<boolean> {
    return this.client
      .methodCall('copy_item', [what, objectId, newName, token])
      .pipe(
        map<MethodResponse | MethodFault, boolean>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as boolean;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Copying the requested item failed with code "' + data.faultCode + '" and error message "'
              + data.faultString + '"');
          }
        })
      );
  }

  copy_distro(objectId: string, newName: string, token: string): Observable<boolean> {
    return this.client
      .methodCall('copy_distro', [objectId, newName, token])
      .pipe(
        map<MethodResponse | MethodFault, boolean>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as boolean;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Copying the requested distro failed with code "' + data.faultCode + '" and error message "'
              + data.faultString + '"');
          }
        })
      );
  }

  copy_profile(objectId: string, newName: string, token: string): Observable<boolean> {
    return this.client
      .methodCall('copy_profile', [objectId, newName, token])
      .pipe(
        map<MethodResponse | MethodFault, boolean>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as boolean;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Copying the requested profile failed with code "' + data.faultCode
              + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  copy_system(objectId: string, newName: string, token: string): Observable<boolean> {
    return this.client
      .methodCall('copy_system', [objectId, newName, token])
      .pipe(
        map<MethodResponse | MethodFault, boolean>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as boolean;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Copying the requested system failed with code "' + data.faultCode + '" and error message "'
              + data.faultString + '"');
          }
        })
      );
  }

  copy_repo(objectId: string, newName: string, token: string): Observable<boolean> {
    return this.client
      .methodCall('copy_repo', [objectId, newName, token])
      .pipe(
        map<MethodResponse | MethodFault, boolean>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as boolean;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Copying the requested repository failed with code "' + data.faultCode
              + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  copy_image(objectId: string, newName: string, token: string): Observable<boolean> {
    return this.client
      .methodCall('copy_image', [objectId, newName, token])
      .pipe(
        map<MethodResponse | MethodFault, boolean>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as boolean;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Copying the requested image failed with code "' + data.faultCode + '" and error message "'
              + data.faultString + '"');
          }
        })
      );
  }

  copy_mgmtclass(objectId: string, newName: string, token: string): Observable<boolean> {
    return this.client
      .methodCall('copy_mgmtclass', [objectId, newName, token])
      .pipe(
        map<MethodResponse | MethodFault, boolean>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as boolean;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Copying the requested management class failed with code "' + data.faultCode
              + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  copy_package(objectId: string, newName: string, token: string): Observable<boolean> {
    return this.client
      .methodCall('copy_package', [objectId, newName, token])
      .pipe(
        map<MethodResponse | MethodFault, boolean>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as boolean;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Copying the requested package failed with code "' + data.faultCode
              + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  copy_file(objectId: string, newName: string, token: string): Observable<boolean> {
    return this.client
      .methodCall('copy_file', [objectId, newName, token])
      .pipe(
        map<MethodResponse | MethodFault, boolean>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as boolean;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Copying the requested file failed with code "' + data.faultCode + '" and error message "'
              + data.faultString + '"');
          }
        })
      );
  }

  rename_item(what: string, objectId: string, newName: string, token: string): Observable<boolean> {
    return this.client
      .methodCall('rename_item', [objectId, newName, token])
      .pipe(
        map<MethodResponse | MethodFault, boolean>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as boolean;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Renaming the requested item failed with code "' + data.faultCode + '" and error message "'
              + data.faultString + '"');
          }
        })
      );
  }

  rename_distro(objectId: string, newName: string, token: string): Observable<boolean> {
    return this.client
      .methodCall('rename_distro', [objectId, newName, token])
      .pipe(
        map<MethodResponse | MethodFault, boolean>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as boolean;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Renaming the requested distro failed with code "' + data.faultCode
              + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  rename_profile(objectId: string, newName: string, token: string): Observable<boolean> {
    return this.client
      .methodCall('rename_profile', [objectId, newName, token])
      .pipe(
        map<MethodResponse | MethodFault, boolean>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as boolean;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Renaming the requested profile failed with code "' + data.faultCode
              + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  rename_system(objectId: string, newName: string, token: string): Observable<boolean> {
    return this.client
      .methodCall('rename_system', [objectId, newName, token])
      .pipe(
        map<MethodResponse | MethodFault, boolean>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as boolean;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Renaming the requested system failed with code "' + data.faultCode
              + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  rename_repo(objectId: string, newName: string, token: string): Observable<boolean> {
    return this.client
      .methodCall('rename_repo', [objectId, newName, token])
      .pipe(
        map<MethodResponse | MethodFault, boolean>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as boolean;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Renaming the requested repository failed with code "' + data.faultCode
              + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  rename_image(objectId: string, newName: string, token: string): Observable<boolean> {
    return this.client
      .methodCall('rename_image', [objectId, newName, token])
      .pipe(
        map<MethodResponse | MethodFault, boolean>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as boolean;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Renaming the requested image failed with code "' + data.faultCode + '" and error message "'
              + data.faultString + '"');
          }
        })
      );
  }

  rename_mgmtclass(objectId: string, newName: string, token: string): Observable<boolean> {
    return this.client
      .methodCall('rename_mgmtclass', [objectId, newName, token])
      .pipe(
        map<MethodResponse | MethodFault, boolean>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as boolean;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Renaming the requested management class failed with code "' + data.faultCode
              + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  rename_package(objectId: string, newName: string, token: string): Observable<boolean> {
    return this.client
      .methodCall('rename_package', [objectId, newName, token])
      .pipe(
        map<MethodResponse | MethodFault, boolean>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as boolean;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Renaming the requested package failed with code "' + data.faultCode
              + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  rename_file(objectId: string, newName: string, token: string): Observable<boolean> {
    return this.client
      .methodCall('rename_file', [objectId, newName, token])
      .pipe(
        map<MethodResponse | MethodFault, boolean>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as boolean;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Renaming the requested file failed with code "' + data.faultCode + '" and error message "'
              + data.faultString + '"');
          }
        })
      );
  }

  new_item(what: string, token: string, isSubobject = false): Observable<string> {
    return this.client
      .methodCall('new_item', [what, token, isSubobject])
      .pipe(
        map<MethodResponse | MethodFault, string>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as string;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Creating a new item failed with code "' + data.faultCode + '" and error message "'
              + data.faultString + '"');
          }
        })
      );
  }

  new_distro(token: string): Observable<string> {
    return this.client
      .methodCall('new_distro', [token])
      .pipe(
        map<MethodResponse | MethodFault, string>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as string;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Creating a new distro failed with code "' + data.faultCode + '" and error message "'
              + data.faultString + '"');
          }
        })
      );
  }

  new_profile(token: string): Observable<string> {
    return this.client
      .methodCall('new_profile', [token])
      .pipe(
        map<MethodResponse | MethodFault, string>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as string;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Creating a new profile failed with code "' + data.faultCode + '" and error message "'
              + data.faultString + '"');
          }
        })
      );
  }

  new_subprofile(token: string): Observable<string> {
    return this.client
      .methodCall('new_subprofile', [token])
      .pipe(
        map<MethodResponse | MethodFault, string>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as string;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Creating a new subprofile failed with code "' + data.faultCode + '" and error message "'
              + data.faultString + '"');
          }
        })
      );
  }

  new_system(token: string): Observable<string> {
    return this.client
      .methodCall('new_system', [token])
      .pipe(
        map<MethodResponse | MethodFault, string>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as string;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Creating a new system failed with code "' + data.faultCode + '" and error message "'
              + data.faultString + '"');
          }
        })
      );
  }

  new_repo(token: string): Observable<string> {
    return this.client
      .methodCall('new_repo', [token])
      .pipe(
        map<MethodResponse | MethodFault, string>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as string;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Creating a new repository failed with code "' + data.faultCode + '" and error message "'
              + data.faultString + '"');
          }
        })
      );
  }

  new_image(token: string): Observable<string> {
    return this.client
      .methodCall('new_image', [token])
      .pipe(
        map<MethodResponse | MethodFault, string>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as string;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Creating a new image failed with code "' + data.faultCode + '" and error message "'
              + data.faultString + '"');
          }
        })
      );
  }

  new_mgmtclass(token: string): Observable<string> {
    return this.client
      .methodCall('new_mgmtclass', [token])
      .pipe(
        map<MethodResponse | MethodFault, string>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as string;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Creating a new management class failed with code "' + data.faultCode
              + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  new_package(token: string): Observable<string> {
    return this.client
      .methodCall('new_package', [token])
      .pipe(
        map<MethodResponse | MethodFault, string>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as string;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Creating a new package failed with code "' + data.faultCode + '" and error message "'
              + data.faultString + '"');
          }
        })
      );
  }

  new_file(token: string): Observable<string> {
    return this.client
      .methodCall('new_file', [token])
      .pipe(
        map<MethodResponse | MethodFault, string>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as string;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Creating a new file failed with code "' + data.faultCode + '" and error message "'
              + data.faultString + '"');
          }
        })
      );
  }

  modify_item(what: string, objectId: string, attribute: string, arg: any, token: string): Observable<boolean> {
    return this.client
      .methodCall('modify_item', [what, objectId, attribute, arg, token])
      .pipe(
        map<MethodResponse | MethodFault, boolean>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as boolean;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Modifying the requested item failed with code "' + data.faultCode + '" and error message "'
              + data.faultString + '"');
          }
        })
      );
  }

  modify_distro(objectId: string, attribute: string, arg: any, token: string): Observable<boolean> {
    return this.client
      .methodCall('modify_distro', [objectId, attribute, arg, token])
      .pipe(
        map<MethodResponse | MethodFault, boolean>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as boolean;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Modifying the requested distro failed with code "' + data.faultCode
              + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  modify_profile(objectId: string, attribute: string, arg: any, token: string): Observable<boolean> {
    return this.client
      .methodCall('modify_profile', [objectId, attribute, arg, token])
      .pipe(
        map<MethodResponse | MethodFault, boolean>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as boolean;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Modifying the requested profile failed with code "' + data.faultCode
              + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  modify_system(objectId: string, attribute: string, arg: any, token: string): Observable<boolean> {
    return this.client
      .methodCall('modify_system', [objectId, attribute, arg, token])
      .pipe(
        map<MethodResponse | MethodFault, boolean>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as boolean;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Modifying the requested system failed with code "' + data.faultCode
              + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  modify_image(objectId: string, attribute: string, arg: any, token: string): Observable<boolean> {
    return this.client
      .methodCall('modify_image', [objectId, attribute, arg, token])
      .pipe(
        map<MethodResponse | MethodFault, boolean>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as boolean;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Modifying the requested image failed with code "' + data.faultCode
              + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  modify_repo(objectId: string, attribute: string, arg: any, token: string): Observable<boolean> {
    return this.client
      .methodCall('modify_repo', [objectId, attribute, arg, token])
      .pipe(
        map<MethodResponse | MethodFault, boolean>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as boolean;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Modifying the requested repository failed with code "' + data.faultCode
              + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  modify_mgmtclass(objectId: string, attribute: string, arg: any, token: string): Observable<boolean> {
    return this.client
      .methodCall('modify_mgmtclass', [objectId, attribute, arg, token])
      .pipe(
        map<MethodResponse | MethodFault, boolean>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as boolean;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Modifying the requested management class failed with code "' + data.faultCode
              + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  modify_package(objectId: string, attribute: string, arg: any, token: string): Observable<boolean> {
    return this.client
      .methodCall('modify_package', [objectId, attribute, arg, token])
      .pipe(
        map<MethodResponse | MethodFault, boolean>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as boolean;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Modifying the requested package failed with code "' + data.faultCode
              + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  modify_file(objectId: string, attribute: string, arg: any, token: string): Observable<boolean> {
    return this.client
      .methodCall('modify_file', [objectId, attribute, arg, token])
      .pipe(
        map<MethodResponse | MethodFault, boolean>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as boolean;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Modifying the requested file failed with code "' + data.faultCode + '" and error message "'
              + data.faultString + '"');
          }
        })
      );
  }

  modify_setting(name: string, value: any, token: string): Observable<number> {
    return this.client
      .methodCall('modify_setting', [name, value, token])
      .pipe(
        map<MethodResponse | MethodFault, number>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as number;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Modifying the requested setting failed with code "' + data.faultCode
              + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  auto_add_repos(token: string): Observable<boolean> {
    return this.client
      .methodCall('auto_add_repos', [token])
      .pipe(
        map<MethodResponse | MethodFault, boolean>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as boolean;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Auto adding the repositories failed with code "' + data.faultCode + '" and error message "'
              + data.faultString + '"');
          }
        })
      );
  }

  xapi_object_edit(
    objectType: string, objectName: string, editType: string, attributes: XmlRpcStruct, token: string
  ): Observable<boolean> {
    return this.client
      .methodCall('xapi_object_edit', [objectType, objectName, editType, attributes, token])
      .pipe(
        map<MethodResponse | MethodFault, boolean>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as boolean;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('xapi_object_edit failed with code "' + data.faultCode + '" and error message "'
              + data.faultString + '"');
          }
        })
      );
  }

  save_item(what: string, objectId: string, token: string, editmode = 'bypass'): Observable<boolean> {
    return this.client
      .methodCall('save_item', [what, objectId, token, editmode])
      .pipe(
        map<MethodResponse | MethodFault, boolean>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as boolean;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Saving the requested item failed with code "' + data.faultCode + '" and error message "'
              + data.faultString + '"');
          }
        })
      );
  }

  save_distro(objectId: string, token: string, editmode = 'bypass'): Observable<boolean> {
    return this.client
      .methodCall('save_distro', [objectId, token, editmode])
      .pipe(
        map<MethodResponse | MethodFault, boolean>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as boolean;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Saving the requested distro failed with code "' + data.faultCode + '" and error message "'
              + data.faultString + '"');
          }
        })
      );
  }

  save_profile(objectId: string, token: string, editmode = 'bypass'): Observable<boolean> {
    return this.client
      .methodCall('save_profile', [objectId, token, editmode])
      .pipe(
        map<MethodResponse | MethodFault, boolean>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as boolean;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Saving the requested profile failed with code "' + data.faultCode + '" and error message "'
              + data.faultString + '"');
          }
        })
      );
  }

  save_system(objectId: string, token: string, editmode = 'bypass'): Observable<boolean> {
    return this.client
      .methodCall('save_system', [objectId, token, editmode])
      .pipe(
        map<MethodResponse | MethodFault, boolean>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as boolean;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Saving the requested system failed with code "' + data.faultCode + '" and error message "'
              + data.faultString + '"');
          }
        })
      );
  }

  save_image(objectId: string, token: string, editmode = 'bypass'): Observable<boolean> {
    return this.client
      .methodCall('save_image', [objectId, token, editmode])
      .pipe(
        map<MethodResponse | MethodFault, boolean>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as boolean;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Saving the requested image failed with code "' + data.faultCode + '" and error message "'
              + data.faultString + '"');
          }
        })
      );
  }

  save_repo(objectId: string, token: string, editmode = 'bypass'): Observable<boolean> {
    return this.client
      .methodCall('save_repo', [objectId, token, editmode])
      .pipe(
        map<MethodResponse | MethodFault, boolean>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as boolean;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Saving the requested repository failed with code "' + data.faultCode
              + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  save_mgmtclass(objectId: string, token: string, editmode = 'bypass'): Observable<boolean> {
    return this.client
      .methodCall('save_mgmtclass', [objectId, token, editmode])
      .pipe(
        map<MethodResponse | MethodFault, boolean>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as boolean;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Saving the requested management class failed with code "' + data.faultCode
              + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  save_package(objectId: string, token: string, editmode = 'bypass'): Observable<boolean> {
    return this.client
      .methodCall('save_package', [objectId, token, editmode])
      .pipe(
        map<MethodResponse | MethodFault, boolean>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as boolean;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Saving the requested package failed with code "' + data.faultCode + '" and error message "'
              + data.faultString + '"');
          }
        })
      );
  }

  save_file(objectId: string, token: string, editmode = 'bypass'): Observable<boolean> {
    return this.client
      .methodCall('save_file', [objectId, token, editmode])
      .pipe(
        map<MethodResponse | MethodFault, boolean>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as boolean;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Saving the requested file failed with code "' + data.faultCode + '" and error message "'
              + data.faultString + '"');
          }
        })
      );
  }

  get_autoinstall_templates(token: string): Observable<Array<any>> {
    return this.client
      .methodCall('get_autoinstall_templates', [token])
      .pipe(
        map<MethodResponse | MethodFault, Array<any>>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as unknown as Array<any>;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Getting the requested auto-installation templates failed with code "' + data.faultCode
              + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  get_autoinstall_snippets(token: string): Observable<Array<any>> {
    return this.client
      .methodCall('get_autoinstall_templates', [token])
      .pipe(
        map<MethodResponse | MethodFault, Array<any>>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as unknown as Array<any>;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Getting the requested auto-installation snippets failed with code "' + data.faultCode
              + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  is_autoinstall_in_use(ai: string, token: string): Observable<boolean> {
    return this.client
      .methodCall('is_autoinstall_in_use', [ai, token])
      .pipe(
        map<MethodResponse | MethodFault, boolean>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as boolean;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Checking if the auto-installation is in use failed with code "' + data.faultCode
              + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  generate_autoinstall(profile: string, system: string): Observable<string> {
    return this.client
      .methodCall('generate_autoinstall', [profile, system])
      .pipe(
        map<MethodResponse | MethodFault, string>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as string;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Generating the auto-installation file failed with code "' + data.faultCode
              + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  generate_profile_autoinstall(profile: string): Observable<string> {
    return this.client
      .methodCall('generate_profile_autoinstall', [profile])
      .pipe(
        map<MethodResponse | MethodFault, string>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as string;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Generating the auto-installation for the requested profile failed with code "'
              + data.faultCode + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  generate_system_autoinstall(system: string): Observable<string> {
    return this.client
      .methodCall('generate_system_autoinstall', [system])
      .pipe(
        map<MethodResponse | MethodFault, string>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as string;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Generating the auto-installation for the requested system failed with code "'
              + data.faultCode + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  generate_ipxe(profile: string, image: string, system: string): Observable<string> {
    return this.client
      .methodCall('generate_ipxe', [profile, image, system])
      .pipe(
        map<MethodResponse | MethodFault, string>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as string;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Generating the requested iPXE data failed with code "' + data.faultCode
              + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  generate_bootcfg(profile: string, system: string): Observable<string> {
    return this.client
      .methodCall('generate_bootcfg', [profile, system])
      .pipe(
        map<MethodResponse | MethodFault, string>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as string;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Generating the boofcfg for the requested profile or system failed with code "'
              + data.faultCode + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  generate_script(profile: string, system: string, scriptName: string): Observable<string> {
    return this.client
      .methodCall('generate_script', [profile, system, scriptName])
      .pipe(
        map<MethodResponse | MethodFault, string>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as string;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Generating the requested script for the system or profile failed with code "'
              + data.faultCode + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  get_blended_data(profile: string, system: string): Observable<any> {
    return this.client
      .methodCall('get_blended_data', [profile, system])
      .pipe(
        map<MethodResponse | MethodFault, any>((responseData: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(responseData)) {
            return responseData.value;
          } else if (AngularXmlrpcService.instanceOfMethodFault(responseData)) {
            throw new Error('Getting the blended data for the requested profile or system failed with code "'
              + responseData.faultCode + '" and error message "' + responseData.faultString + '"');
          }
        })
      );
  }

  private convertXmlRpcStructToTypeScriptObject(inputStruct: XmlRpcStruct): object {
    const result_object = {}
    inputStruct.members.forEach((member) => {
      let value;
      if (AngularXmlrpcService.instanceOfXmlRpcArray(member.value)) {
        value = this.convertXmlRpcArrayToTypeScriptArray(member.value);
      } else if (AngularXmlrpcService.instanceOfXmlRpcStruct(member.value)) {
        value = this.convertXmlRpcStructToTypeScriptObject(member.value);
      } else {
        value = member.value;
      }
      result_object[member.name] = value;
    })
    return result_object;
  }

  private convertXmlRpcArrayToTypeScriptArray(inputArray: XmlRpcArray): Array<any> {
    const resultArray = []
    inputArray.data.forEach((value) => {
      if (AngularXmlrpcService.instanceOfXmlRpcArray(value)) {
        resultArray.push(this.convertXmlRpcArrayToTypeScriptArray(value));
      } else if (AngularXmlrpcService.instanceOfXmlRpcStruct(value)) {
        resultArray.push(this.convertXmlRpcStructToTypeScriptObject(value));
      } else {
        resultArray.push(value);
      }
    })
    return resultArray;
  }

  get_settings(token: string): Observable<Settings> {
    return this.client
      .methodCall('get_settings', [token])
      .pipe(
        map<MethodResponse | MethodFault, Settings>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            if (AngularXmlrpcService.instanceOfXmlRpcStruct(data.value)) {
              return this.convertXmlRpcStructToTypeScriptObject(data.value) as Settings;
            }
            throw new Error('The return value of the settings was not in the expected format of an XML-RPC Struct!')
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Retrieving the settings failed with code "' + data.faultCode + '" and error message "'
              + data.faultString + '"');
          }
        })
      );
  }

  get_signatures(token: string): Observable<DistroSignatures> {
    return this.client
      .methodCall('get_signatures', [token])
      .pipe(
        map<MethodResponse | MethodFault, XmlRpcStruct>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as XmlRpcStruct;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Getting the signatures failed with code "' + data.faultCode + '" and error message "'
              + data.faultString + '"');
          }
        }),
        map<XmlRpcStruct, DistroSignatures>(value => {
          let result: DistroSignatures = {breeds: {}}
          value.members.forEach(breedStruct => {
            const osBreedStruct = breedStruct.value
            if (!AngularXmlrpcService.instanceOfXmlRpcStruct(osBreedStruct)) {
              throw new Error("Expected to receive XmlRpcStruct!")
            }
            const osBreedArray = osBreedStruct.members
            osBreedArray.forEach(osBreedObject => {
              const osBreedName = osBreedObject.name
              result.breeds[osBreedName] = {}
              const osVersionArray = osBreedObject.value
              if (!AngularXmlrpcService.instanceOfXmlRpcStruct(osVersionArray)) {
                throw new Error("Expected to receive XmlRpcStruct!")
              }
              osVersionArray.members.forEach(osVersionStruct => {
                const osVersionValueStruct = osVersionStruct.value
                const osVersionName = osVersionStruct.name
                if (!AngularXmlrpcService.instanceOfXmlRpcStruct(osVersionValueStruct)) {
                  throw new Error("Expected to receive XmlRpcStruct!")
                }
                // @ts-ignore - Due to this being dynamically filled
                result.breeds[osBreedName][osVersionName] = {}
                osVersionValueStruct.members.forEach(osVersionAttribute => {
                  const attributeName = osVersionAttribute.name
                  const attributeValue = osVersionAttribute.value
                  if (AngularXmlrpcService.instanceOfXmlRpcArray(attributeValue)) {
                    result.breeds[osBreedName][osVersionName][attributeName] = attributeValue.data
                  } else {
                    result.breeds[osBreedName][osVersionName][attributeName] = attributeValue
                  }
                })
              })
            })
          })
          return result
        })
      );
  }

  get_valid_breeds(token: string): Observable<Array<any>> {
    return this.client
      .methodCall('get_valid_breeds', [token])
      .pipe(
        map<MethodResponse | MethodFault, Array<any>>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as unknown as Array<any>;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Getting the valid breeds failed with code "' + data.faultCode + '" and error message "'
              + data.faultString + '"');
          }
        })
      );
  }

  get_valid_os_versions_for_breed(token: string): Observable<Array<any>> {
    return this.client
      .methodCall('get_valid_os_versions_for_breed', [token])
      .pipe(
        map<MethodResponse | MethodFault, Array<any>>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as unknown as Array<any>;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Getting the valid OS versions for the requested breed failed with code "' + data.faultCode
              + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  get_valid_os_versions(token: string): Observable<Array<any>> {
    return this.client
      .methodCall('get_valid_os_versions', [token])
      .pipe(
        map<MethodResponse | MethodFault, Array<any>>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as unknown as Array<any>;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Getting the valid OS versions failed with code "' + data.faultCode
              + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  get_valid_archs(systemName: string, token: string): Observable<Array<string>> {
    return this.client
      .methodCall('get_valid_archs', [systemName, token])
      .pipe(
        map<MethodResponse | MethodFault, Array<string>>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            // FIXME: Make the cast without the unknown possible
            return data.value as unknown as Array<string>;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Getting the valid architectures for the requested system failed with code "'
              + data.faultCode + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  get_repo_config_for_profile(profileName: string): Observable<string> {
    return this.client
      .methodCall('get_repo_config_for_profile', [profileName])
      .pipe(
        map<MethodResponse | MethodFault, string>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as string;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Getting the repository configuration for the requested profile failed with code "'
              + data.faultCode + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  get_repo_config_for_system(systemName: string): Observable<string> {
    return this.client
      .methodCall('get_repo_config_for_system', [systemName])
      .pipe(
        map<MethodResponse | MethodFault, string>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as string;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Getting the repository configuration for the requested system failed with code "'
              + data.faultCode + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  get_template_file_for_profile(profileName: string, path: string): Observable<string> {
    return this.client
      .methodCall('get_template_file_for_profile', [profileName, path])
      .pipe(
        map<MethodResponse | MethodFault, string>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as string;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Getting the requested templdate for the requested profile failed with code "'
              + data.faultCode + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  get_template_file_for_system(systemName: string, path: string): Observable<string> {
    return this.client
      .methodCall('get_template_file_for_system', [systemName, path])
      .pipe(
        map<MethodResponse | MethodFault, string>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as string;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Getting the requested template for requested the system failed with code "'
              + data.faultCode + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  register_new_system(info: RegisterOptions): Observable<boolean> {
    const transformedOptions: XmlRpcStruct = {
      members: [
        {name: 'name', value: info.name},
        {name: 'profile', value: info.profile},
        {name: 'hostname', value: info.hostname},
        {name: 'interfaces', value: info.interfaces as XmlRpcStruct},
      ]
    }
    return this.client
      .methodCall('register_new_system', [transformedOptions])
      .pipe(
        map<MethodResponse | MethodFault, boolean>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as boolean;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Registering a new system failed with code "' + data.faultCode + '" and error message "'
              + data.faultString + '"');
          }
        })
      );
  }

  disable_netboot(name: string, token: string): Observable<boolean> {
    return this.client
      .methodCall('disable_netboot', [name, token])
      .pipe(
        map<MethodResponse | MethodFault, boolean>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as boolean;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Disabling netboot for the requested system failed with code "' + data.faultCode
              + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  upload_log_data(sysName: string, file: any, size: any, offset: any, data: any, token: string): Observable<boolean> {
    return this.client
      .methodCall('upload_log_data', [sysName, file, size, offset, data, token])
      .pipe(
        map<MethodResponse | MethodFault, boolean>((responseData: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(responseData)) {
            return responseData.value as boolean;
          } else if (AngularXmlrpcService.instanceOfMethodFault(responseData)) {
            throw new Error('Uploading the log data failed with code "' + responseData.faultCode
              + '" and error message "' + responseData.faultString + '"');
          }
        })
      );
  }

  run_install_triggers(mode: string, objtype: string, name: string, ip: any, token: string): Observable<boolean> {
    return this.client
      .methodCall('run_install_triggers', [mode, objtype, name, ip, token])
      .pipe(
        map<MethodResponse | MethodFault, boolean>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as boolean;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Running the install triggers failed with code "' + data.faultCode + '" and error message "'
              + data.faultString + '"');
          }
        })
      );
  }

  version(): Observable<number> {
    return this.client
      .methodCall('version')
      .pipe(
        map<MethodResponse | MethodFault, number>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as number;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Getting the Cobbler version failed with code "' + data.faultCode + '" and error message "'
              + data.faultString + '"');
          }
        })
      );
  }

  extended_version(): Observable<ExtendedVersion> {
    return this.client
      .methodCall('extended_version')
      .pipe(
        map<MethodResponse | MethodFault, XmlRpcStruct>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as XmlRpcStruct;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Getting the extended Cobbler version failed with code "' + data.faultCode
              + '" and error message "' + data.faultString + '"');
          }
        }),
        map<XmlRpcStruct, ExtendedVersion>((data: XmlRpcStruct) => {
          const versionArray = data.members[4].value as XmlRpcArray;
          return {
            gitdate: data.members[0].value,
            gitstamp: data.members[1].value,
            builddate: data.members[2].value,
            version: data.members[3].value,
            versionTuple: {
              major: versionArray.data[0],
              minor: versionArray.data[1],
              patch: versionArray.data[2]
            } as Version
          } as ExtendedVersion;
        })
      );
  }

  get_distros_since(mtime: number): Observable<object> {
    return this.client
      .methodCall('get_distros_since', [mtime])
      .pipe(
        map<MethodResponse | MethodFault, object>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as object;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Getting the distros modified since the requested mtime failed with code "' + data.faultCode
              + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  get_profiles_since(mtime: number): Observable<object> {
    return this.client
      .methodCall('get_profiles_since', [mtime])
      .pipe(
        map<MethodResponse | MethodFault, object>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as object;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Getting the profiles modified since the requested mtime failed with code "'
              + data.faultCode + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  get_systems_since(mtime: number): Observable<object> {
    return this.client
      .methodCall('get_systems_since', [mtime])
      .pipe(
        map<MethodResponse | MethodFault, object>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as object;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Getting the systems modified since the requested mtime failed with code "' + data.faultCode
              + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  get_repos_since(mtime: number): Observable<object> {
    return this.client
      .methodCall('get_repos_since', [mtime])
      .pipe(
        map<MethodResponse | MethodFault, object>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as object;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Getting the repositories modified since the requested mtime failed with code "'
              + data.faultCode + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  get_images_since(mtime: number): Observable<object> {
    return this.client
      .methodCall('get_images_since', [mtime])
      .pipe(
        map<MethodResponse | MethodFault, object>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as object;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Getting the images modified since the requested mtime failed with code "' + data.faultCode
              + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  get_mgmtclasses_since(mtime: number): Observable<object> {
    return this.client
      .methodCall('get_mgmtclasses_since', [mtime])
      .pipe(
        map<MethodResponse | MethodFault, object>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as object;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Getting the management classes modified since the requested mtime failed with code "'
              + data.faultCode + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  get_packages_since(mtime: number): Observable<object> {
    return this.client
      .methodCall('get_packages_since', [mtime])
      .pipe(
        map<MethodResponse | MethodFault, object>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as object;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Getting the packages modified since the requested mtime failed with code "'
              + data.faultCode + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  get_files_since(mtime: number): Observable<object> {
    return this.client
      .methodCall('get_files_since', [mtime])
      .pipe(
        map<MethodResponse | MethodFault, object>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as object;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Getting the files modified since the requested mtime failed with code "' + data.faultCode
              + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  // TODO: Add gem_menus_since

  get_repos_compatible_with_profile(profile: string, token: string): Observable<string> {
    return this.client
      .methodCall('get_repos_compatible_with_profile', [profile, token])
      .pipe(
        map<MethodResponse | MethodFault, string>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as string;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Getting the repositories compatible with the requested profile failed with code "'
              + data.faultCode + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  find_system_by_dns_name(dnsName: string): Observable<object> {
    return this.client
      .methodCall('find_system_by_dns_name', [dnsName])
      .pipe(
        map<MethodResponse | MethodFault, object>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as object;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Finding a system by its DNS name failed with code "' + data.faultCode
              + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  get_distro_as_rendered(name: string, token: string): Observable<object> {
    return this.client
      .methodCall('get_distro_as_rendered', [name, token])
      .pipe(
        map<MethodResponse | MethodFault, object>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as object;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Getting the requested distro in a rendered format failed with code "' + data.faultCode
              + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  get_profile_as_rendered(name: string, token: string): Observable<object> {
    return this.client
      .methodCall('get_profile_as_rendered', [name, token])
      .pipe(
        map<MethodResponse | MethodFault, object>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as object;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Getting the requested profile in a rendered format failed with code "' + data.faultCode
              + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  get_system_as_rendered(name: string, token: string): Observable<object> {
    return this.client
      .methodCall('get_system_as_rendered', [name, token])
      .pipe(
        map<MethodResponse | MethodFault, object>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as object;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Getting the requested system in a rendered format failed with code "' + data.faultCode
              + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  get_repo_as_rendered(name: string, token: string): Observable<object> {
    return this.client
      .methodCall('get_repo_as_rendered', [name, token])
      .pipe(
        map<MethodResponse | MethodFault, object>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as object;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Getting the requested repository in a rendered format failed with code "' + data.faultCode
              + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  get_image_as_rendered(name: string, token: string): Observable<object> {
    return this.client
      .methodCall('get_image_as_rendered', [name, token])
      .pipe(
        map<MethodResponse | MethodFault, object>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as object;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Getting the requested image in a rendered format failed with code "' + data.faultCode
              + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  get_mgmtclass_as_rendered(name: string, token: string): Observable<object> {
    return this.client
      .methodCall('get_mgmtclass_as_rendered', [name, token])
      .pipe(
        map<MethodResponse | MethodFault, object>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as object;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Getting the requested management class in a rendered format failed with code "'
              + data.faultCode + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  get_package_as_rendered(name: string, token: string): Observable<object> {
    return this.client
      .methodCall('get_package_as_rendered', [name, token])
      .pipe(
        map<MethodResponse | MethodFault, object>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as object;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Getting the requested package in a rendered format failed with code "' + data.faultCode
              + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  get_file_as_rendered(name: string, token: string): Observable<object> {
    return this.client
      .methodCall('get_file_as_rendered', [name, token])
      .pipe(
        map<MethodResponse | MethodFault, object>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as object;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Getting the requested file in a rendered format failed with code "' + data.faultCode
              + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  // TODO: menu_as_rendered

  get_random_mac(virtType: string): Observable<string> {
    return this.client
      .methodCall('get_random_mac', [virtType])
      .pipe(
        map<MethodResponse | MethodFault, string>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as string;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Getting a random MAC address failed with code "' + data.faultCode + '" and error message "'
              + data.faultString + '"');
          }
        })
      );
  }

  xmlrpc_hacks(data: any): Observable<any> {
    return this.client
      .methodCall('xmlrpc_hacks', [data])
      .pipe(
        map<MethodResponse | MethodFault, any>((responseData: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(responseData)) {
            return responseData.value;
          } else if (AngularXmlrpcService.instanceOfMethodFault(responseData)) {
            throw new Error('Executing the XML-RPC hacks failed with code "' + responseData.faultCode
              + '" and error message "' + responseData.faultString + '"');
          }
        })
      );
  }

  get_status(mode: string, token: string): Observable<Array<InstallationStatus>> {
    return this.client
      .methodCall('get_status', [mode, token])
      .pipe(
        map<MethodResponse | MethodFault, XmlRpcStruct>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as XmlRpcStruct;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Getting the status failed with code "' + data.faultCode + '" and error message "'
              + data.faultString + '"');
          }
        }),
        map<XmlRpcStruct, Array<InstallationStatus>>((data: XmlRpcStruct) => {
          let result: Array<InstallationStatus> = [];
          data.members.forEach( element => {
            const membersArray = element.value as XmlRpcArray
            result.push({
              ip: element.name,
              mostRecentStart: membersArray.data[0] as number,
              mostRecentStop: membersArray.data[1] as number,
              mostRecentTarget: membersArray.data[2] as string,
              seenStart: membersArray.data[3] as number,
              seenStop: membersArray.data[4] as number,
              state: membersArray.data[5] as string,
            })
          })
          return result;
        })
      );
  }

  check_access_no_fail(token: string, resource: string, arg1: any, arg2: any): Observable<boolean> {
    return this.client
      .methodCall('check_access_no_fail', [token, resource, arg1, arg2])
      .pipe(
        map<MethodResponse | MethodFault, boolean>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as boolean;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Checking the access without failure failed with code "' + data.faultCode
              + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  check_access(token: string, resource: string, arg1: any, arg2: any): Observable<boolean> {
    return this.client
      .methodCall('check_access', [token, resource, arg1, arg2])
      .pipe(
        map<MethodResponse | MethodFault, boolean>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as boolean;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Checking the access failed with code "' + data.faultCode + '" and error message "'
              + data.faultString + '"');
          }
        })
      );
  }

  get_authn_module_name(token: string): Observable<string> {
    return this.client
      .methodCall('get_authn_module_name', [token])
      .pipe(
        map<MethodResponse | MethodFault, string>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as string;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Getting the authentication module name failed with code "' + data.faultCode
              + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  login(username: string, password: string): Observable<string> {
    return this.client
      .methodCall('login', [username, password])
      .pipe(
        map<MethodResponse | MethodFault, string>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as string;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Login failed with code "' + data.faultCode + '" and error message "'
              + data.faultString + '"');
          }
        })
      );
  }

  logout(token: string): Observable<boolean> {
    return this.client
      .methodCall('logout', [token])
      .pipe(
        map<MethodResponse | MethodFault, boolean>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as boolean;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Logout failed with code "' + data.faultCode + '" and error message "'
              + data.faultString + '"');
          }
        })
      );
  }

  token_check(token: string): Observable<boolean> {
    return this.client
      .methodCall('token_check', [token])
      .pipe(
        map<MethodResponse | MethodFault, boolean>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as boolean;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Check of the token failed with code "' + data.faultCode + '" and error message "'
              + data.faultString + '"');
          }
        })
      );
  }

  sync_dhcp(token: string): Observable<boolean> {
    return this.client
      .methodCall('sync_dhcp', [token])
      .pipe(
        map<MethodResponse | MethodFault, boolean>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as boolean;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('The sync DHCP action failed with code "' + data.faultCode + '" and error message "'
              + data.faultString + '"');
          }
        })
      );
  }

  sync(token: string): Observable<boolean> {
    return this.client
      .methodCall('sync', [token])
      .pipe(
        map<MethodResponse | MethodFault, boolean>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as boolean;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('The sync action failed with code "' + data.faultCode + '" and error message "'
              + data.faultString + '"');
          }
        })
      );
  }

  read_autoinstall_template(filePath: string, token: string): Observable<string> {
    return this.client
      .methodCall('read_autoinstall_template', [filePath, token])
      .pipe(
        map<MethodResponse | MethodFault, string>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as string;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Reading the auto-installation template failed with code "' + data.faultCode
              + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  write_autoinstall_template(filePath: string, data: string, token: string): Observable<boolean> {
    return this.client
      .methodCall('write_autoinstall_template', [filePath, data, token])
      .pipe(
        map<MethodResponse | MethodFault, boolean>((responseData: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(responseData)) {
            return responseData.value as boolean;
          } else if (AngularXmlrpcService.instanceOfMethodFault(responseData)) {
            throw new Error('Writing the auto-installation template failed with code "' + responseData.faultCode
              + '" and error message "' + responseData.faultString + '"');
          }
        })
      );
  }

  remove_autoinstall_template(filePath: string, token: string): Observable<boolean> {
    return this.client
      .methodCall('remove_autoinstall_template', [filePath, token])
      .pipe(
        map<MethodResponse | MethodFault, boolean>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as boolean;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Removing the auto-installation template failed with code "' + data.faultCode
              + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  read_autoinstall_snippet(filePath: string, token: string): Observable<string> {
    return this.client
      .methodCall('read_autoinstall_snippet', [filePath, token])
      .pipe(
        map<MethodResponse | MethodFault, string>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as string;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Reading the auto-installation snippet failed with code "' + data.faultCode
              + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  write_autoinstall_snippet(filePath: string, data: string, token: string): Observable<boolean> {
    return this.client
      .methodCall('write_autoinstall_snippet', [filePath, data, token])
      .pipe(
        map<MethodResponse | MethodFault, boolean>((responseData: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(responseData)) {
            return responseData.value as boolean;
          } else if (AngularXmlrpcService.instanceOfMethodFault(responseData)) {
            throw new Error('Writing the auto-installation snippet failed with code "' + responseData.faultCode
              + '" and error message "' + responseData.faultString + '"');
          }
        })
      );
  }

  remove_autoinstall_snippet(filePath: string, token: string): Observable<boolean> {
    return this.client
      .methodCall('remove_autoinstall_snippet', [filePath, token])
      .pipe(
        map<MethodResponse | MethodFault, boolean>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as boolean;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Removing the auto-installation snippet failed with code "' + data.faultCode
              + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  get_config_data(hostname: string): Observable<string> {
    return this.client
      .methodCall('get_config_data', [hostname])
      .pipe(
        map<MethodResponse | MethodFault, string>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as string;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Retrieving the configuration data failed with code "' + data.faultCode
              + '" and error message "' + data.faultString + '"');
          }
        })
      );
  }

  clear_system_logs(objectId: string, token: string): Observable<boolean> {
    return this.client
      .methodCall('clear_system_logs', [objectId, token])
      .pipe(
        map<MethodResponse | MethodFault, boolean>((data: MethodResponse | MethodFault) => {
          if (AngularXmlrpcService.instanceOfMethodResponse(data)) {
            return data.value as boolean;
          } else if (AngularXmlrpcService.instanceOfMethodFault(data)) {
            throw new Error('Clearing the system logs failed with code "' + data.faultCode + '" and error message "'
              + data.faultString + '"');
          }
        })
      );
  }
}

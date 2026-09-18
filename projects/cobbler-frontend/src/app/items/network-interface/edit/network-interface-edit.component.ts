import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { CobblerApiService, NetworkInterface } from 'cobbler-api';
import { combineLatest, Observable, Subject } from 'rxjs';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import { DialogBoxConfirmCancelEditComponent } from '../../../common/dialog-box-confirm-cancel-edit/dialog-box-confirm-cancel-edit.component';
import { KeyValueEditorComponent } from '../../../common/key-value-editor/key-value-editor.component';
import { MultiSelectComponent } from '../../../common/multi-select/multi-select.component';
import { UserService } from '../../../services/user.service';
import Utils, { CobblerInputChoices, CobblerInputData } from '../../../utils';
import { HelpButtonComponent } from '../../../common/help-button/help-button.component';

@Component({
  selector: 'cobbler-network-interface-edit',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    KeyValueEditorComponent,
    MatButtonModule,
    MatCheckboxModule,
    MultiSelectComponent,
    ReactiveFormsModule,
    MatIconModule,
    MatTooltipModule,
    HelpButtonComponent,
  ],
  templateUrl: './network-interface-edit.component.html',
  styleUrl: './network-interface-edit.component.scss',
})
export class NetworkInterfaceEditComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);
  private cobblerApiService = inject(CobblerApiService);
  private router = inject(Router);
  private readonly _formBuilder = inject(FormBuilder);
  private _snackBar = inject(MatSnackBar);
  readonly dialog = inject<MatDialog>(MatDialog);

  // Bring Enum to HTML scope
  protected readonly CobblerInputChoices = CobblerInputChoices;

  // Unsubscribe
  private ngUnsubscribe = new Subject<void>();

  // Form data
  networkInterfaceEditableInputData: Array<CobblerInputData> = [
    {
      formControlName: 'bonding_opts',
      inputType: CobblerInputChoices.TEXT,
      label: $localize`:@@network-interface.edit.label.bonding_opts:Bonding Options`,
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
      hint: $localize`:@@network-interface.edit.hint.bonding_opts:Options passed to the kernel bonding driver, e.g. "miimon=100 mode=1".`,
    },
    {
      formControlName: 'bridge_opts',
      inputType: CobblerInputChoices.TEXT,
      label: $localize`:@@network-interface.edit.label.bridge_opts:Bridge Options`,
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
      hint: $localize`:@@network-interface.edit.hint.bridge_opts:Options passed to the bridge driver.`,
    },
    {
      formControlName: 'cnames',
      inputType: CobblerInputChoices.MULTI_SELECT,
      label: $localize`:@@network-interface.edit.label.cnames:DNS Common Names`,
      disabled: true,
      readonly: false,
      defaultValue: [],
      inherited: false,
      hint: $localize`:@@network-interface.edit.hint.cnames:Additional CNAME (alias) hostnames for this interface.`,
    },
    {
      formControlName: 'connected_mode',
      inputType: CobblerInputChoices.CHECKBOX,
      label: $localize`:@@network-interface.edit.label.connected_mode:Connected Mode`,
      disabled: true,
      readonly: false,
      defaultValue: false,
      inherited: false,
      hint: $localize`:@@network-interface.edit.hint.connected_mode:Use connected mode for InfiniBand interfaces.`,
    },
    {
      formControlName: 'dhcp_tag',
      inputType: CobblerInputChoices.TEXT,
      label: $localize`:@@network-interface.edit.label.dhcp_tag:DHCP Tag`,
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
      hint: $localize`:@@network-interface.edit.hint.dhcp_tag:VLAN tag identifying the DHCP network this interface is provisioned from.`,
    },
    {
      formControlName: 'dns_name',
      inputType: CobblerInputChoices.TEXT,
      label: $localize`:@@network-interface.edit.label.dns_name:DNS Name`,
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
      hint: $localize`:@@network-interface.edit.hint.dns_name:Fully qualified hostname for this interface.`,
    },
    {
      formControlName: 'if_gateway',
      inputType: CobblerInputChoices.TEXT,
      label: $localize`:@@network-interface.edit.label.if_gateway:Interface Gateway (IPv4)`,
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
      hint: $localize`:@@network-interface.edit.hint.if_gateway:Per-interface IPv4 gateway. Overrides the system-level gateway for this interface.`,
    },
    {
      formControlName: 'interface_master',
      inputType: CobblerInputChoices.TEXT,
      label: $localize`:@@network-interface.edit.label.interface_master:Interface Master`,
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
      hint: $localize`:@@network-interface.edit.hint.interface_master:Name of the bond or bridge this interface is a member of.`,
    },
    {
      formControlName: 'interface_type',
      inputType: CobblerInputChoices.TEXT,
      label: $localize`:@@network-interface.edit.label.interface_type:Interface Type`,
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
      hint: $localize`:@@network-interface.edit.hint.interface_type:Interface kind: bond, bond_slave, bridge, bridge_slave, infiniband, or na (regular).`,
    },
    {
      formControlName: 'ip_address',
      inputType: CobblerInputChoices.TEXT,
      label: $localize`:@@network-interface.edit.label.ip_address:IPv4 Address`,
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
      hint: $localize`:@@network-interface.edit.hint.ip_address:IPv4 address assigned to this interface.`,
    },
    {
      formControlName: 'ipv6_address',
      inputType: CobblerInputChoices.TEXT,
      label: $localize`:@@network-interface.edit.label.ipv6_address:IPv6 Address`,
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
      hint: $localize`:@@network-interface.edit.hint.ipv6_address:IPv6 address assigned to this interface.`,
    },
    {
      formControlName: 'ipv6_default_gateway',
      inputType: CobblerInputChoices.TEXT,
      label: $localize`:@@network-interface.edit.label.ipv6_default_gateway:IPv6 Default Gateway`,
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
      hint: $localize`:@@network-interface.edit.hint.ipv6_default_gateway:IPv6 gateway for this interface.`,
    },
    {
      formControlName: 'ipv6_mtu',
      inputType: CobblerInputChoices.TEXT,
      label: $localize`:@@network-interface.edit.label.ipv6_mtu:IPv6 MTU`,
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
      hint: $localize`:@@network-interface.edit.hint.ipv6_mtu:Maximum transmission unit size for IPv6 on this interface.`,
    },
    {
      formControlName: 'ipv6_prefix',
      inputType: CobblerInputChoices.TEXT,
      label: $localize`:@@network-interface.edit.label.ipv6_prefix:IPv6 Prefix`,
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
      hint: $localize`:@@network-interface.edit.hint.ipv6_prefix:IPv6 prefix length for this interface, e.g. 64.`,
    },
    {
      formControlName: 'ipv6_secondaries',
      inputType: CobblerInputChoices.MULTI_SELECT,
      label: $localize`:@@network-interface.edit.label.ipv6_secondaries:IPv6 Secondaries`,
      disabled: true,
      readonly: false,
      defaultValue: [],
      inherited: false,
      hint: $localize`:@@network-interface.edit.hint.ipv6_secondaries:Additional IPv6 addresses assigned to this interface.`,
    },
    {
      formControlName: 'ipv6_static_routes',
      inputType: CobblerInputChoices.MULTI_SELECT,
      label: $localize`:@@network-interface.edit.label.ipv6_static_routes:IPv6 Static Routes`,
      disabled: true,
      readonly: false,
      defaultValue: [],
      inherited: false,
      hint: $localize`:@@network-interface.edit.hint.ipv6_static_routes:Static IPv6 routes assigned to this interface.`,
    },
    {
      formControlName: 'mac_address',
      inputType: CobblerInputChoices.TEXT,
      label: $localize`:@@network-interface.edit.label.mac_address:MAC Address`,
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
      hint: $localize`:@@network-interface.edit.hint.mac_address:Hardware MAC address of this interface, e.g. AA:BB:CC:DD:EE:FF.`,
    },
    {
      formControlName: 'management',
      inputType: CobblerInputChoices.CHECKBOX,
      label: $localize`:@@network-interface.edit.label.management:Management Mode`,
      disabled: true,
      readonly: false,
      defaultValue: false,
      inherited: false,
      hint: $localize`:@@network-interface.edit.hint.management:Mark this as the management interface (used for out-of-band access).`,
    },
    {
      formControlName: 'mtu',
      inputType: CobblerInputChoices.TEXT,
      label: $localize`:@@network-interface.edit.label.mtu:IPv4 MTU`,
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
      hint: $localize`:@@network-interface.edit.hint.mtu:Maximum transmission unit size in bytes (e.g. 1500 or 9000 for jumbo frames).`,
    },
    {
      formControlName: 'netmask',
      inputType: CobblerInputChoices.TEXT,
      label: $localize`:@@network-interface.edit.label.netmask:IPv4 Netmask`,
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
      hint: $localize`:@@network-interface.edit.hint.netmask:IPv4 subnet mask for this interface, e.g. 255.255.255.0.`,
    },
    {
      formControlName: 'static',
      inputType: CobblerInputChoices.CHECKBOX,
      label: $localize`:@@network-interface.edit.label.static:Is Interface static?`,
      disabled: true,
      readonly: false,
      defaultValue: false,
      inherited: false,
      hint: $localize`:@@network-interface.edit.hint.static:Use a static IP address rather than DHCP for this interface.`,
    },
    {
      formControlName: 'static_routes',
      inputType: CobblerInputChoices.MULTI_SELECT,
      label: $localize`:@@network-interface.edit.label.static_routes:IPv4 Static Routes`,
      disabled: true,
      readonly: false,
      defaultValue: [],
      inherited: false,
      hint: $localize`:@@network-interface.edit.hint.static_routes:Static routes assigned to this interface in the format "network/prefix:gateway".`,
    },
    {
      formControlName: 'virt_bridge',
      inputType: CobblerInputChoices.TEXT,
      label: $localize`:@@network-interface.edit.label.virt_bridge:Virtual Bridge`,
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
      hint: $localize`:@@network-interface.edit.hint.virt_bridge:Virtual bridge to attach this interface to. Defaults to the global default_virt_bridge setting.`,
    },
  ];

  // Form
  systemName: string;
  interfaceName: string;
  networkInterface: NetworkInterface;
  networkInterfaceFormGroup = this._formBuilder.group({});
  isEditMode: boolean = false;

  constructor() {
    this.systemName = this.route.snapshot.paramMap.get('name');
    this.interfaceName = this.route.snapshot.paramMap.get('interface');
    Utils.fillupSingleFormGroup(
      this.networkInterfaceFormGroup,
      this.networkInterfaceEditableInputData,
    );
  }

  ngOnInit(): void {
    this.refreshData();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  refreshData(): void {
    this.getInterface()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((value) => {
        if (!value) {
          // getInterface() already redirected to the 404 page.
          return;
        }
        this.networkInterface = value;
        this.networkInterfaceFormGroup.patchValue({
          bonding_opts: this.networkInterface.bonding_opts,
          bridge_opts: this.networkInterface.bridge_opts,
          connected_mode: this.networkInterface.connected_mode,
          dhcp_tag: this.networkInterface.dhcp_tag,
          if_gateway: this.networkInterface.if_gateway,
          interface_master: this.networkInterface.interface_master,
          interface_type: this.networkInterface.interface_type,
          // `ipv6_default_gateway` and `ipv6_static_routes` are genuine top-level
          // NetworkInterface attributes and are deliberately NOT read from the `ipv6`
          // sub-object, which carries its own distinct `default_gateway`/`static_routes`.
          ipv6_default_gateway: this.networkInterface.ipv6_default_gateway,
          ipv6_static_routes: this.networkInterface.ipv6_static_routes,
          mac_address: this.networkInterface.mac_address,
          management: this.networkInterface.management,
          static: this.networkInterface.static,
          virt_bridge: this.networkInterface.virt_bridge,
          // Attributes that Cobbler 4.0.0 moved into the nested dns/ipv4/ipv6 sub-objects.
          // None of them can hold the `<<inherit>>` sentinel, so they are patched plainly
          // instead of through Utils.patchFormGroupInherited().
          cnames: this.networkInterface.dns.common_names,
          dns_name: this.networkInterface.dns.name,
          ip_address: this.networkInterface.ipv4.address,
          mtu: this.networkInterface.ipv4.mtu,
          netmask: this.networkInterface.ipv4.netmask,
          static_routes: this.networkInterface.ipv4.static_routes,
          ipv6_address: this.networkInterface.ipv6.address,
          ipv6_mtu: this.networkInterface.ipv6.mtu,
          ipv6_prefix: this.networkInterface.ipv6.prefix,
          ipv6_secondaries: this.networkInterface.ipv6.secondaries,
        });
      });
  }

  removeInterface(): void {
    // Since Cobbler 4.0.0 a network interface is a top-level item with its own collection, so it
    // is deleted through remove_network_interface(). The previous implementation called
    // modify_system(handle, ['delete_interface'], ...); that RPC operation does not exist, so the
    // backend just set a throwaway attribute on the System object and reported success while the
    // interface stayed in place.
    this.cobblerApiService
      .remove_network_interface(
        this.networkInterface.uid,
        this.userService.token,
        false,
      )
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (value) => {
          if (value) {
            this.router.navigate([
              '/items',
              'system',
              this.systemName,
              'interface',
            ]);
          } else {
            this._snackBar.open(
              $localize`:@@error.delete-failed:Delete failed! Check server logs for more information.`,
              $localize`:@@snackbar.action.close:Close`,
            );
          }
        },
        error: (err) => {
          // HTML encode the error message since it originates from XML
          this._snackBar.open(
            Utils.toHTML(err.message),
            $localize`:@@snackbar.action.close:Close`,
          );
        },
      });
  }

  editInterface(): void {
    this.isEditMode = true;
    this.networkInterfaceFormGroup.enable();
  }

  cancelEdit(): void {
    const dialogRef = this.dialog.open(DialogBoxConfirmCancelEditComponent, {
      data: {
        name: this.interfaceName,
      },
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult === false) {
        // False means the user want's to continue
        return;
      }
      this.isEditMode = false;
      this.networkInterfaceFormGroup.disable();
      this.refreshData();
    });
  }

  getInterface(): Observable<NetworkInterface> {
    return this.cobblerApiService
      .get_system(this.systemName, false, false, this.userService.token)
      .pipe(takeUntil(this.ngUnsubscribe))
      .pipe(
        switchMap((cobblerSystem) =>
          this.cobblerApiService.find_network_interface(
            { system_uid: cobblerSystem.uid, name: this.interfaceName },
            true,
            false,
            this.userService.token,
          ),
        ),
        map((networkInterfaces) => {
          if (networkInterfaces.length === 0) {
            this.router.navigate(['404']);
            return;
          }
          return networkInterfaces[0];
        }),
      );
  }

  // Attributes that Cobbler 4.0.0 moved under the interface's nested dns/ipv4/ipv6 sub-objects.
  // The form control names below stay flat for the UI, but must be written back through their
  // real nested `attribute` path in modify_network_interface().
  private static readonly NESTED_ATTRIBUTE_PATHS: Record<string, string[]> = {
    cnames: ['dns', 'common_names'],
    dns_name: ['dns', 'name'],
    ip_address: ['ipv4', 'address'],
    mtu: ['ipv4', 'mtu'],
    netmask: ['ipv4', 'netmask'],
    static_routes: ['ipv4', 'static_routes'],
    ipv6_address: ['ipv6', 'address'],
    ipv6_mtu: ['ipv6', 'mtu'],
    ipv6_prefix: ['ipv6', 'prefix'],
    ipv6_secondaries: ['ipv6', 'secondaries'],
  };

  saveInterface(): void {
    if (!this.networkInterface) {
      // refreshData() has not resolved the interface (yet), so there is nothing to save.
      return;
    }
    const dirtyValues = Utils.deduplicateDirtyValues(
      this.networkInterfaceFormGroup,
      Utils.getDirtyValues(this.networkInterfaceFormGroup),
    );
    // An XML-RPC item handle is simply the item's UID. get_network_interface_handle() resolves a
    // handle from a plain name, but interface names are only unique per system (two systems both
    // owning an "eth0" is the normal case) and the backend then aborts with "ambiguous match for
    // given collection and name". getInterface() already resolved this interface unambiguously
    // via system_uid + name, so its UID is used directly as the handle.
    const networkInterfaceHandle = this.networkInterface.uid;
    const modifyObservables: Observable<boolean>[] = [];
    dirtyValues.forEach((value, key) => {
      modifyObservables.push(
        this.cobblerApiService.modify_network_interface(
          networkInterfaceHandle,
          NetworkInterfaceEditComponent.NESTED_ATTRIBUTE_PATHS[key] ?? [key],
          value,
          this.userService.token,
        ),
      );
    });
    if (modifyObservables.length === 0) {
      // combineLatest([]) completes without ever emitting, so short-circuit to the save.
      this.persistInterface(networkInterfaceHandle);
      return;
    }
    combineLatest(modifyObservables)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: () => {
          this.persistInterface(networkInterfaceHandle);
        },
        error: (error) => {
          this._snackBar.open(
            Utils.toHTML(error.message),
            $localize`:@@snackbar.action.close:Close`,
          );
        },
      });
  }

  private persistInterface(networkInterfaceHandle: string): void {
    this.cobblerApiService
      .save_network_interface(
        networkInterfaceHandle,
        false,
        false,
        '',
        this.userService.token,
      )
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: () => {
          this.isEditMode = false;
          this.networkInterfaceFormGroup.disable();
          this.refreshData();
        },
        error: (error) => {
          this._snackBar.open(
            Utils.toHTML(error.message),
            $localize`:@@snackbar.action.close:Close`,
          );
        },
      });
  }
}

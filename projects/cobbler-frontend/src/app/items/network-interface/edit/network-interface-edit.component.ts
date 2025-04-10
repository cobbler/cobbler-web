import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { CobblerApiService, NetworkInterface, System } from 'cobbler-api';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { DialogBoxConfirmCancelEditComponent } from '../../../common/dialog-box-confirm-cancel-edit/dialog-box-confirm-cancel-edit.component';
import { KeyValueEditorComponent } from '../../../common/key-value-editor/key-value-editor.component';
import { MultiSelectComponent } from '../../../common/multi-select/multi-select.component';
import { UserService } from '../../../services/user.service';
import Utils, { CobblerInputChoices, CobblerInputData } from '../../../utils';

@Component({
  selector: 'cobbler-network-interface-edit',
  standalone: true,
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
  ],
  templateUrl: './network-interface-edit.component.html',
  styleUrl: './network-interface-edit.component.scss',
})
export class NetworkInterfaceEditComponent implements OnInit, OnDestroy {
  // Bring Enum to HTML scope
  protected readonly CobblerInputChoices = CobblerInputChoices;

  // Unsubscribe
  private ngUnsubscribe = new Subject<void>();

  // Form data
  networkInterfaceEditableInputData: Array<CobblerInputData> = [
    {
      formControlName: 'bonding_opts',
      inputType: CobblerInputChoices.TEXT,
      label: 'Bonding Options',
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
    },
    {
      formControlName: 'bridge_opts',
      inputType: CobblerInputChoices.TEXT,
      label: 'Bridge Options',
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
    },
    {
      formControlName: 'cnames',
      inputType: CobblerInputChoices.MULTI_SELECT,
      label: 'DNS Common Names',
      disabled: true,
      readonly: false,
      defaultValue: [],
      inherited: false,
    },
    {
      formControlName: 'connected_mode',
      inputType: CobblerInputChoices.CHECKBOX,
      label: 'Connected Mode',
      disabled: true,
      readonly: false,
      defaultValue: false,
      inherited: false,
    },
    {
      formControlName: 'dhcp_tag',
      inputType: CobblerInputChoices.TEXT,
      label: 'DHCP Tag',
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
    },
    {
      formControlName: 'dns_name',
      inputType: CobblerInputChoices.TEXT,
      label: 'DNS Name',
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
    },
    {
      formControlName: 'if_gateway',
      inputType: CobblerInputChoices.TEXT,
      label: 'Interface Gateway (IPv4)',
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
    },
    {
      formControlName: 'interface_master',
      inputType: CobblerInputChoices.TEXT,
      label: 'Interface Master',
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
    },
    {
      formControlName: 'interface_type',
      inputType: CobblerInputChoices.TEXT,
      label: 'Interface Type',
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
    },
    {
      formControlName: 'ip_address',
      inputType: CobblerInputChoices.TEXT,
      label: 'IPv4 Address',
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
    },
    {
      formControlName: 'ipv6_address',
      inputType: CobblerInputChoices.TEXT,
      label: 'IPv6 Address',
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
    },
    {
      formControlName: 'ipv6_default_gateway',
      inputType: CobblerInputChoices.TEXT,
      label: 'IPv6 Default Gateway',
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
    },
    {
      formControlName: 'ipv6_mtu',
      inputType: CobblerInputChoices.TEXT,
      label: 'IPv6 MTU',
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
    },
    {
      formControlName: 'ipv6_prefix',
      inputType: CobblerInputChoices.TEXT,
      label: 'IPv6 Prefix',
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
    },
    {
      formControlName: 'ipv6_secondaries',
      inputType: CobblerInputChoices.MULTI_SELECT,
      label: 'IPv6 Secondaries',
      disabled: true,
      readonly: false,
      defaultValue: [],
      inherited: false,
    },
    {
      formControlName: 'ipv6_static_routes',
      inputType: CobblerInputChoices.MULTI_SELECT,
      label: 'IPv6 Static Routes',
      disabled: true,
      readonly: false,
      defaultValue: [],
      inherited: false,
    },
    {
      formControlName: 'mac_address',
      inputType: CobblerInputChoices.TEXT,
      label: 'MAC Address',
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
    },
    {
      formControlName: 'management',
      inputType: CobblerInputChoices.CHECKBOX,
      label: 'Management Mode',
      disabled: true,
      readonly: false,
      defaultValue: false,
      inherited: false,
    },
    {
      formControlName: 'mtu',
      inputType: CobblerInputChoices.TEXT,
      label: 'IPv4 MTU',
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
    },
    {
      formControlName: 'netmask',
      inputType: CobblerInputChoices.TEXT,
      label: 'IPv4 Netmask',
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
    },
    {
      formControlName: 'static',
      inputType: CobblerInputChoices.CHECKBOX,
      label: 'Is Interface static?',
      disabled: true,
      readonly: false,
      defaultValue: false,
      inherited: false,
    },
    {
      formControlName: 'static_routes',
      inputType: CobblerInputChoices.MULTI_SELECT,
      label: 'IPv4 Static Routes',
      disabled: true,
      readonly: false,
      defaultValue: [],
      inherited: false,
    },
    {
      formControlName: 'virt_bridge',
      inputType: CobblerInputChoices.TEXT,
      label: 'Virtual Bridge',
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
    },
  ];

  // Form
  systemName: string;
  interfaceName: string;
  networkInterface: NetworkInterface;
  networkInterfaceFormGroup = this._formBuilder.group({});
  isEditMode: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private cobblerApiService: CobblerApiService,
    private router: Router,
    private readonly _formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    @Inject(MatDialog) readonly dialog: MatDialog,
  ) {
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
        this.networkInterface = value;
        this.networkInterfaceFormGroup.patchValue({
          bonding_opts: this.networkInterface.bonding_opts,
          bridge_opts: this.networkInterface.bridge_opts,
          cnames: this.networkInterface.cnames,
          connected_mode: this.networkInterface.connected_mode,
          dhcp_tag: this.networkInterface.dhcp_tag,
          dns_name: this.networkInterface.dns_name,
          if_gateway: this.networkInterface.if_gateway,
          interface_master: this.networkInterface.interface_master,
          interface_type: this.networkInterface.interface_type,
          ip_address: this.networkInterface.ip_address,
          ipv6_address: this.networkInterface.ipv6_address,
          ipv6_default_gateway: this.networkInterface.ipv6_default_gateway,
          ipv6_mtu: this.networkInterface.ipv6_mtu,
          ipv6_prefix: this.networkInterface.ipv6_prefix,
          ipv6_secondaries: this.networkInterface.ipv6_secondaries,
          ipv6_static_routes: this.networkInterface.ipv6_static_routes,
          mac_address: this.networkInterface.mac_address,
          management: this.networkInterface.management,
          mtu: this.networkInterface.mtu,
          netmask: this.networkInterface.mtu,
          static: this.networkInterface.static,
          static_routes: this.networkInterface.static_routes,
          virt_bridge: this.networkInterface.virt_bridge,
        });
      });
  }

  removeInterface(): void {
    this.cobblerApiService
      .get_system_handle(this.systemName, this.userService.token)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (systemToken) => {
          this.cobblerApiService
            .modify_system(
              systemToken,
              'delete_interface',
              this.interfaceName,
              this.userService.token,
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
                    'Delete failed! Check server logs for more information.',
                    'Close',
                  );
                }
              },
              error: (err) => {
                // HTML encode the error message since it originates from XML
                this._snackBar.open(Utils.toHTML(err.message), 'Close');
              },
            });
        },
        error: (err) => {
          // HTML encode the error message since it originates from XML
          this._snackBar.open(Utils.toHTML(err.message), 'Close');
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

  getInterfaces(): Observable<Map<string, NetworkInterface>> {
    return this.cobblerApiService
      .get_system(this.systemName, false, false, this.userService.token)
      .pipe(takeUntil(this.ngUnsubscribe))
      .pipe(
        map<System, Map<string, NetworkInterface>>((cobblerSystem) => {
          const result = new Map<string, NetworkInterface>();
          cobblerSystem.interfaces.forEach(
            (networkInterfaceMap, networkInterfaceName) => {
              const networkInterfaceObject = Object.fromEntries(
                networkInterfaceMap,
              ) as NetworkInterface;
              result.set(networkInterfaceName, networkInterfaceObject);
            },
          );
          return result;
        }),
      );
  }

  getInterface(): Observable<NetworkInterface> {
    return this.getInterfaces().pipe(
      map((source) => {
        if (!source.has(this.interfaceName)) {
          this.router.navigate(['404']);
          return;
        }
        return source.get(this.interfaceName);
      }),
    );
  }

  saveInterface() {
    let dirtyValues = Utils.deduplicateDirtyValues(
      this.networkInterfaceFormGroup,
      Utils.getDirtyValues(this.networkInterfaceFormGroup),
    );
    this.cobblerApiService
      .get_system_handle(this.systemName, this.userService.token)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (systemHandle) => {
          const interfaceMap = new Map<string, any>();
          dirtyValues.forEach((value, key) => {
            interfaceMap.set(key + '-' + this.interfaceName, value);
          });
          this.cobblerApiService
            .modify_system(
              systemHandle,
              'modify_interface',
              interfaceMap,
              this.userService.token,
            )
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe({
              next: () => {
                this.cobblerApiService
                  .save_system(systemHandle, this.userService.token)
                  .subscribe({
                    next: () => {
                      this.isEditMode = false;
                      this.networkInterfaceFormGroup.disable();
                      this.refreshData();
                    },
                    error: (error) => {
                      this._snackBar.open(Utils.toHTML(error.message), 'Close');
                    },
                  });
              },
              error: (error) => {
                this._snackBar.open(Utils.toHTML(error.message), 'Close');
              },
            });
        },
        error: (error) => {
          this._snackBar.open(Utils.toHTML(error.message), 'Close');
        },
      });
  }
}

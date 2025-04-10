import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { CobblerApiService, NetworkInterface, System } from 'cobbler-api';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { KeyValueEditorComponent } from '../../../common/key-value-editor/key-value-editor.component';
import { MultiSelectComponent } from '../../../common/multi-select/multi-select.component';
import { UserService } from '../../../services/user.service';
import { CobblerInputChoices, CobblerInputData } from '../../../utils';

@Component({
  selector: 'cobbler-network-interface-edit',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    KeyValueEditorComponent,
    MatButton,
    MatCheckbox,
    MultiSelectComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './network-interface-edit.component.html',
  styleUrl: './network-interface-edit.component.scss',
})
export class NetworkInterfaceEditComponent implements OnDestroy {
  // Bring Enum to HTML scope
  protected readonly CobblerInputChoices = CobblerInputChoices;

  // Unsubscribe
  private ngUnsubscribe = new Subject<void>();

  // Form data
  networkInterfaceEditableInputData: Array<CobblerInputData>;

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
  ) {
    this.systemName = this.route.snapshot.paramMap.get('name');
    this.interfaceName = this.route.snapshot.paramMap.get('interface');
    this.getInterface().subscribe((value) => {
      this.networkInterface = value;
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  getInterfaces(): Observable<Map<string, NetworkInterface>> {
    return this.cobblerApiService
      .get_system(this.systemName, false, false, this.userService.token)
      .pipe(
        map<System, Map<string, NetworkInterface>>((value) => {
          const result = new Map<string, NetworkInterface>();
          value.interfaces.forEach((value1, key) => {
            result[key] = Object.fromEntries(value1) as NetworkInterface;
          });
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
    // TODO
  }
}

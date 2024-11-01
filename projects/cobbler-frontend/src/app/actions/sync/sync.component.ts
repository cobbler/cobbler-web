import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDialogClose } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import {
  MatFormField,
  MatInput,
  MatPrefix,
  MatSuffix,
} from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterOutlet } from '@angular/router';
import { CobblerApiService } from 'cobbler-api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserService } from '../../services/user.service';
import Utils from '../../utils';

@Component({
  selector: 'cobbler-sync',
  templateUrl: './sync.component.html',
  styleUrls: ['./sync.component.css'],
  standalone: true,
  imports: [
    RouterOutlet,
    MatButton,
    MatDialogClose,
    ReactiveFormsModule,
    MatCheckbox,
    CommonModule,
    MatInput,
    MatIconButton,
    MatIcon,
    MatFormField,
    MatPrefix,
    MatSuffix,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SyncComponent implements OnDestroy {
  // Unsubscribe
  private ngUnsubscribe = new Subject<void>();

  // Form
  private readonly _formBuilder = inject(FormBuilder);
  readonly fullSync = this._formBuilder.group({
    fullSyncDhcp: false,
    fullSyncDns: false,
    fullSyncVerbose: false,
  });

  keyValueFA = new FormArray([]);

  systemsSync = this._formBuilder.group({
    keyValue: this.keyValueFA,
    systemsSyncVerbose: false,
  });

  constructor(
    private cobblerApiService: CobblerApiService,
    private userService: UserService,
    private _snackBar: MatSnackBar,
  ) {}

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  get newKeyValueFG(): FormGroup {
    return new FormGroup({
      systemName: new FormControl(null, [Validators.required]),
    });
  }

  get keyValueArrayFGControls(): FormGroup[] {
    return this.keyValueFA.controls as FormGroup[];
  }

  addNewKeyValueFG(): void {
    this.keyValueFA.push(this.newKeyValueFG);
  }

  removeNewKeyValueFG(index: number): void {
    this.keyValueFA.removeAt(index);
  }

  syncFullSubmit(): void {
    const syncOptions = {
      dhcp: this.fullSync.controls.fullSyncDhcp.value,
      dns: this.fullSync.controls.fullSyncDns.value,
      verbose: this.fullSync.controls.fullSyncVerbose.value,
    };
    this.fullSync.controls.fullSyncDhcp.reset(false);
    this.fullSync.controls.fullSyncDns.reset(false);
    this.fullSync.controls.fullSyncVerbose.reset(false);
    this.cobblerApiService
      .background_sync(syncOptions, this.userService.token)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (value) => {
          console.log(value);
        },
        (error) => {
          // HTML encode the error message since it originates from XML
          this._snackBar.open(Utils.toHTML(error.message), 'Close');
        },
      );
  }

  syncSystemsSubmit(): void {
    if (this.systemsSync.invalid) {
      for (let control of this.systemsSync.controls.keyValue.controls) {
        control.markAsTouched();
      }
      this._snackBar.open('Please give all inputs a system name!', 'Close', {
        duration: 2000,
      });
      return;
    }
    let systemNames: Array<string> = [];
    for (let control of this.systemsSync.controls.keyValue.controls) {
      if (control instanceof FormGroup) {
        systemNames.push(control.value.systemName);
      }
    }
    const syncOptions = {
      systems: systemNames,
      verbose: this.systemsSync.controls.systemsSyncVerbose.value,
    };
    this.systemsSync.controls.systemsSyncVerbose.reset(false);
    this.systemsSync.controls.keyValue.reset([]);

    this.cobblerApiService
      .background_syncsystems(syncOptions, this.userService.token)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (value) => {
          console.log(value);
        },
        (error) => {
          // HTML encode the error message since it originates from XML
          this._snackBar.open(Utils.toHTML(error.message), 'Close');
        },
      );
  }
}

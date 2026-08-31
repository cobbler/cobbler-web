import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterOutlet } from '@angular/router';
import { CobblerApiService } from 'cobbler-api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserService } from '../../services/user.service';
import Utils from '../../utils';
import {
  MultiSelectStrictComponent,
  MultiSelectStrictOption,
} from 'projects/cobbler-frontend/src/app/common/multi-select-strict/multi-select-strict.component';

@Component({
  selector: 'cobbler-sync',
  templateUrl: './sync.component.html',
  styleUrls: ['./sync.component.css'],
  imports: [
    RouterOutlet,
    MatButton,
    ReactiveFormsModule,
    MatCheckbox,
    MultiSelectStrictComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SyncComponent implements OnInit, OnDestroy {
  private cobblerApiService = inject(CobblerApiService);
  private userService = inject(UserService);
  private _snackBar = inject(MatSnackBar);

  // Unsubscribe
  private ngUnsubscribe = new Subject<void>();

  // Form
  private readonly _formBuilder = inject(FormBuilder);
  readonly fullSync = this._formBuilder.group({
    fullSyncDhcp: false,
    fullSyncDns: false,
    fullSyncVerbose: false,
  });

  systemsSync = this._formBuilder.group({
    systems: this._formBuilder.control<string[]>([]),
    systemsSyncVerbose: false,
  });

  systemOptions: Array<MultiSelectStrictOption> = [];

  ngOnInit(): void {
    this.cobblerApiService
      .get_systems()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((systems) => {
        this.systemOptions = systems.map((system) => ({
          value: system.uid,
          label: system.name,
        }));
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
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
          this._snackBar.open(
            Utils.toHTML(error.message),
            $localize`:@@snackbar.action.close:Close`,
          );
        },
      );
  }

  syncSystemsSubmit(): void {
    const syncOptions = {
      systems: this.systemsSync.controls.systems.value ?? [],
      verbose: this.systemsSync.controls.systemsSyncVerbose.value,
    };
    this.systemsSync.controls.systemsSyncVerbose.reset(false);
    this.systemsSync.controls.systems.reset([]);

    this.cobblerApiService
      .background_syncsystems(syncOptions, this.userService.token)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (value) => {
          console.log(value);
        },
        (error) => {
          // HTML encode the error message since it originates from XML
          this._snackBar.open(
            Utils.toHTML(error.message),
            $localize`:@@snackbar.action.close:Close`,
          );
        },
      );
  }
}

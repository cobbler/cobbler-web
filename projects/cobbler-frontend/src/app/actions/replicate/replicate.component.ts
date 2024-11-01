import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatFormField, MatInput } from '@angular/material/input';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BackgroundReplicateOptions, CobblerApiService } from 'cobbler-api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserService } from '../../services/user.service';
import Utils from '../../utils';

@Component({
  selector: 'cobbler-replicate',
  standalone: true,
  imports: [
    MatFormField,
    ReactiveFormsModule,
    MatLabel,
    MatFormFieldModule,
    MatInput,
    MatSlideToggle,
    MatButton,
  ],
  templateUrl: './replicate.component.html',
  styleUrl: './replicate.component.scss',
})
export class ReplicateComponent implements OnDestroy {
  // Unsubscribe
  private ngUnsubscribe = new Subject<void>();

  // Form
  private readonly _formBuilder = inject(FormBuilder);
  replicateFormGroup = this._formBuilder.group({
    master: '',
    port: '',
    distro_patterns: '',
    profile_patterns: '',
    system_patterns: '',
    repo_patterns: '',
    image_patterns: '',
    mgmtclass_patterns: '',
    package_patterns: '',
    file_patterns: '',
    prune: false,
    omit_data: false,
    sync_all: false,
    use_ssl: false,
  });

  constructor(
    public userService: UserService,
    private cobblerApiService: CobblerApiService,
    private _snackBar: MatSnackBar,
  ) {}

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  runReplicate(): void {
    const replicateOptions: BackgroundReplicateOptions = {
      master: this.replicateFormGroup.controls.master.value,
      port: this.replicateFormGroup.controls.port.value,
      distro_patterns: this.replicateFormGroup.controls.distro_patterns.value,
      profile_patterns: this.replicateFormGroup.controls.profile_patterns.value,
      system_patterns: this.replicateFormGroup.controls.system_patterns.value,
      repo_patterns: this.replicateFormGroup.controls.repo_patterns.value,
      image_patterns: this.replicateFormGroup.controls.image_patterns.value,
      mgmtclass_patterns:
        this.replicateFormGroup.controls.mgmtclass_patterns.value,
      package_patterns: this.replicateFormGroup.controls.package_patterns.value,
      file_patterns: this.replicateFormGroup.controls.file_patterns.value,
      prune: this.replicateFormGroup.controls.prune.value,
      omit_data: this.replicateFormGroup.controls.omit_data.value,
      sync_all: this.replicateFormGroup.controls.sync_all.value,
      use_ssl: this.replicateFormGroup.controls.use_ssl.value,
    };
    this.cobblerApiService
      .background_replicate(replicateOptions, this.userService.token)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (value) => {
          // TODO
        },
        (error) => {
          // HTML encode the error message since it originates from XML
          this._snackBar.open(Utils.toHTML(error.message), 'Close');
        },
      );
  }
}

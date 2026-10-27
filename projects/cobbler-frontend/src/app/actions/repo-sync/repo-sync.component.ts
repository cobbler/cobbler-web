import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserService } from '../../services/user.service';
import { CobblerApiService } from 'cobbler-api';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButton } from '@angular/material/button';
import { BackgroundReposyncOptions } from 'cobbler-api';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import Utils from '../../utils';
import {
  MultiSelectStrictComponent,
  MultiSelectStrictOption,
} from 'projects/cobbler-frontend/src/app/common/multi-select-strict/multi-select-strict.component';

@Component({
  selector: 'cobbler-repo-sync',
  templateUrl: './repo-sync.component.html',
  styleUrls: ['./repo-sync.component.css'],
  imports: [
    MatListModule,
    MatButton,
    FormsModule,
    MatCheckbox,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MultiSelectStrictComponent,
  ],
})
export class RepoSyncComponent implements OnInit, OnDestroy {
  userService = inject(UserService);
  private cobblerApiService = inject(CobblerApiService);
  private _snackBar = inject(MatSnackBar);

  // Unsubscribe
  private ngUnsubscribe = new Subject<void>();

  // Form
  private readonly _formBuilder = inject(FormBuilder);
  reposyncFormGroup = this._formBuilder.group({
    repos: this._formBuilder.control<string[]>([]),
    reposyncNoFail: false,
    reposyncTries: 3,
  });

  repoOptions: Array<MultiSelectStrictOption> = [];

  ngOnInit(): void {
    this.cobblerApiService
      .get_repos()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((repos) => {
        this.repoOptions = repos.map((repo) => ({
          value: repo.uid,
          label: repo.name,
        }));
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  runReposync(): void {
    const reposyncOptions: BackgroundReposyncOptions = {
      repos: this.reposyncFormGroup.controls.repos.value ?? [],
      only: '',
      tries: this.reposyncFormGroup.controls.reposyncTries.value,
      nofail: this.reposyncFormGroup.controls.reposyncNoFail.value,
    };
    this.cobblerApiService
      .background_reposync(reposyncOptions, this.userService.token)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (value) => {
          // TODO
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

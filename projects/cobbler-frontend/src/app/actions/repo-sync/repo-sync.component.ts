import { Component, inject, OnDestroy } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { RouterOutlet } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserService } from '../../services/user.service';
import { CobblerApiService } from 'cobbler-api';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButton, MatIconButton } from '@angular/material/button';
import { BackgroundReposyncOptions } from 'cobbler-api';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import {
  MatFormField,
  MatFormFieldModule,
  MatLabel,
  MatPrefix,
  MatSuffix,
} from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput, MatInputModule } from '@angular/material/input';

@Component({
  selector: 'cobbler-repo-sync',
  templateUrl: './repo-sync.component.html',
  styleUrls: ['./repo-sync.component.css'],
  standalone: true,
  imports: [
    RouterOutlet,
    MatListModule,
    MatButton,
    FormsModule,
    MatCheckbox,
    MatFormField,
    MatIcon,
    MatIconButton,
    MatInput,
    MatPrefix,
    MatSuffix,
    MatLabel,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
  ],
})
export class RepoSyncComponent implements OnDestroy {
  // Unsubscribe
  private ngUnsubscribe = new Subject<void>();

  // Form
  private readonly _formBuilder = inject(FormBuilder);
  repositoryFormArray = new FormArray([]);

  reposyncFormGroup = this._formBuilder.group({
    repoName: this.repositoryFormArray,
    reposyncNoFail: false,
    reposyncTries: 3,
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

  get newRepositoryFormGroup(): FormGroup {
    return new FormGroup({
      repoName: new FormControl(null, [Validators.required]),
    });
  }

  get repositoryArrayFGControls(): FormGroup[] {
    return this.repositoryFormArray.controls as FormGroup[];
  }

  addNewRepoFG(): void {
    this.repositoryFormArray.push(this.newRepositoryFormGroup);
  }

  removeNewRepoFG(index: number): void {
    this.repositoryFormArray.removeAt(index);
  }

  runReposync(): void {
    let repoNames: Array<string> = [];
    for (let control of this.reposyncFormGroup.controls.repoName.controls) {
      if (control instanceof FormGroup) {
        repoNames.push(control.value.repoName);
      }
    }
    const reposyncOptions: BackgroundReposyncOptions = {
      repos: repoNames,
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
          this._snackBar.open(this.toHTML(error.message), 'Close');
        },
      );
  }

  toHTML(input: string): any {
    // FIXME: Deduplicate method
    return new DOMParser().parseFromString(input, 'text/html').documentElement
      .textContent;
  }
}

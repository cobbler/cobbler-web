import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatOption} from '@angular/material/autocomplete';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatIcon} from '@angular/material/icon';
import {MatInput} from '@angular/material/input';
import {MatSelect} from '@angular/material/select';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatTooltip} from '@angular/material/tooltip';
import {ActivatedRoute, Router} from '@angular/router';
import {CobblerApiService, Repo} from 'cobbler-api';
import {KeyValueEditorComponent} from '../../../common/key-value-editor/key-value-editor.component';
import {MultiSelectComponent} from '../../../common/multi-select/multi-select.component';
import {UserService} from '../../../services/user.service';

@Component({
  selector: 'cobbler-edit',
  standalone: true,
  imports: [
    FormsModule,
    MatButton,
    MatCheckbox,
    MatFormField,
    MatIcon,
    MatIconButton,
    MatInput,
    MatLabel,
    MatOption,
    MatSelect,
    MatTooltip,
    ReactiveFormsModule,
    MultiSelectComponent,
    KeyValueEditorComponent
  ],
  templateUrl: './repository-edit.component.html',
  styleUrl: './repository-edit.component.scss'
})
export class RepositoryEditComponent implements OnInit {
  name: string;
  repository: Repo;
  private readonly _formBuilder = inject(FormBuilder);
  repositoryFormGroup = this._formBuilder.group({
    name: new FormControl({value: "", disabled: true}),
    uid: new FormControl({value: "", disabled: true}),
    mtime: new FormControl({value: "", disabled: true}),
    ctime: new FormControl({value: "", disabled: true}),
    depth: new FormControl({value: 0, disabled: true}),
    priority: new FormControl({value: 0, disabled: true}),
    is_subobject: new FormControl({value: false, disabled: true}),
    keep_updated: new FormControl({value: false, disabled: true}),
    mirror_locally: new FormControl({value: false, disabled: true}),
    comment: new FormControl({value: "", disabled: true}),
    redhat_management_key: new FormControl({value: "", disabled: true}),
    mirror_type: new FormControl({value: "", disabled: true}),
    mirror: new FormControl({value: "", disabled: true}),
    breed: new FormControl({value: "", disabled: true}),
    os_version: new FormControl({value: "", disabled: true}),
    proxy: new FormControl({value: "", disabled: true}),
    createrepo_flags: new FormControl({value: "", disabled: true}),
    owners: new FormControl({value: [], disabled: true}),
    owners_inherited: new FormControl({value: false, disabled: true}),
    apt_components: new FormControl({value: [], disabled: true}),
    apt_dists: new FormControl({value: [], disabled: true}),
    rpm_list: new FormControl({value: [], disabled: true}),
    environment: new FormControl({value: {}, disabled: true}),
    yumopts: new FormControl({value: {}, disabled: true}),
    rsyncopts: new FormControl({value: {}, disabled: true}),
  });
  isEditMode: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private cobblerApiService: CobblerApiService,
    private _snackBar: MatSnackBar,
    private router: Router,
  ) {
    this.name = this.route.snapshot.paramMap.get("name");
  }

  ngOnInit(): void {
    this.refreshData()
  }

  refreshData(): void {
    this.cobblerApiService.get_repo(this.name, false, false, this.userService.token).subscribe(value => {
      this.repository = value
      this.repositoryFormGroup.controls.name.setValue(this.repository.name)
      this.repositoryFormGroup.controls.uid.setValue(this.repository.uid)
      this.repositoryFormGroup.controls.mtime.setValue(new Date(this.repository.mtime * 1000).toString())
      this.repositoryFormGroup.controls.ctime.setValue(new Date(this.repository.ctime * 1000).toString())
      this.repositoryFormGroup.controls.depth.setValue(this.repository.depth)
      this.repositoryFormGroup.controls.priority.setValue(this.repository.priority)
      this.repositoryFormGroup.controls.is_subobject.setValue(this.repository.is_subobject)
      this.repositoryFormGroup.controls.keep_updated.setValue(this.repository.keep_updated)
      this.repositoryFormGroup.controls.mirror_locally.setValue(this.repository.mirror_locally)
      this.repositoryFormGroup.controls.comment.setValue(this.repository.comment)
      this.repositoryFormGroup.controls.proxy.setValue(this.repository.proxy)
      this.repositoryFormGroup.controls.mirror_type.setValue(this.repository.mirror_type)
      this.repositoryFormGroup.controls.mirror.setValue(this.repository.mirror)
      this.repositoryFormGroup.controls.breed.setValue(this.repository.breed)
      this.repositoryFormGroup.controls.os_version.setValue(this.repository.os_version)
      this.repositoryFormGroup.controls.createrepo_flags.setValue(this.repository.createrepo_flags)
      this.repositoryFormGroup.controls.rpm_list.setValue(this.repository.rpm_list)
      this.repositoryFormGroup.controls.apt_dists.setValue(this.repository.apt_dists)
      this.repositoryFormGroup.controls.apt_components.setValue(this.repository.apt_components)
      if (typeof this.repository.owners === "string") {
        this.repositoryFormGroup.controls.owners_inherited.setValue(true)
      } else {
        this.repositoryFormGroup.controls.owners_inherited.setValue(false)
        this.repositoryFormGroup.controls.owners.setValue(this.repository.owners)
      }
      this.repositoryFormGroup.controls.environment.setValue(this.repository.environment)
      this.repositoryFormGroup.controls.yumopts.setValue(this.repository.yumopts)
      this.repositoryFormGroup.controls.rsyncopts.setValue(this.repository.rsyncopts)
    }, error => {
      // HTML encode the error message since it originates from XML
      this._snackBar.open(this.toHTML(error.message), 'Close');
    });
  }

  removeRepository(): void {
    this.cobblerApiService.remove_repo(this.name, this.userService.token, false).subscribe(value => {
      if (value) {
        this.router.navigate(["/items", "repository"])
      }
      // HTML encode the error message since it originates from XML
      this._snackBar.open("Delete failed! Check server logs for more information.", 'Close');
    }, error => {
      // HTML encode the error message since it originates from XML
      this._snackBar.open(this.toHTML(error.message), 'Close');
    })
  }

  editRepository(): void {
    // TODO
    this._snackBar.open("Not implemented at the moment!", "Close")
  }

  copyRepository(): void {
    this.cobblerApiService.copy_repo("", "", this.userService.token)
      .subscribe(value => {
        // TODO
      }, error => {
        // HTML encode the error message since it originates from XML
        this._snackBar.open(this.toHTML(error.message), 'Close');
      })
  }

  saveRepository(): void {
    // TODO
  }

  get repositoryOwners(): string[] {
    if (this.repository && this.repository.owners) {
      const ownersResult = this.repository.owners
      if (typeof ownersResult !== 'string') {
        return ownersResult;
      }
    }
    return []
  }

  get repositoryYumopts(): object {
    if (this.repository && this.repository.yumopts) {
      const yumoptsResult = this.repository.yumopts
      if (typeof yumoptsResult !== 'string') {
        return yumoptsResult
      }
    }
    return {}
  }

  get repositoryRsyncopts(): object {
    if (this.repository && this.repository.rsyncopts) {
      const rsyncoptsResult = this.repository.rsyncopts
      if (typeof rsyncoptsResult !== 'string') {
        return rsyncoptsResult
      }
    }
    return {}
  }

  toHTML(input: string): any {
    // FIXME: Deduplicate method
    return new DOMParser().parseFromString(input, 'text/html').documentElement.textContent;
  }
}

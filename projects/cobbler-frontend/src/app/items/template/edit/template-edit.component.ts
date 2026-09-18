import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { CobblerApiService, Template } from 'cobbler-api';
import { combineLatest, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DialogBoxConfirmCancelEditComponent } from '../../../common/dialog-box-confirm-cancel-edit/dialog-box-confirm-cancel-edit.component';
import { DialogItemCopyComponent } from '../../../common/dialog-item-copy/dialog-item-copy.component';
import { HelpButtonComponent } from '../../../common/help-button/help-button.component';
import { MultiSelectComponent } from '../../../common/multi-select/multi-select.component';
import { UserService } from '../../../services/user.service';
import Utils, { CobblerInputChoices, CobblerInputData } from '../../../utils';
import { cobblerItemEditableData } from '../../metadata';

@Component({
  selector: 'cobbler-template-edit',
  imports: [
    FormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTooltipModule,
    ReactiveFormsModule,
    MultiSelectComponent,
    HelpButtonComponent,
  ],
  templateUrl: './template-edit.component.html',
  styleUrl: './template-edit.component.scss',
})
export class TemplateEditComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);
  private cobblerApiService = inject(CobblerApiService);
  private _snackBar = inject(MatSnackBar);
  private router = inject(Router);
  readonly dialog = inject<MatDialog>(MatDialog);

  // Bring Enum to HTML scope
  protected readonly CobblerInputChoices = CobblerInputChoices;

  // Unsubscribe
  private ngUnsubscribe = new Subject<void>();

  // Form data
  //
  // Template extends BaseItem directly (not InheritableItem), so it has no
  // depth/is_subobject fields — the shared cobblerItemReadonlyData can't be
  // reused as-is here.
  templateReadonlyInputData: Array<CobblerInputData> = [
    {
      formControlName: 'name',
      inputType: CobblerInputChoices.TEXT,
      label: $localize`:@@item.edit.label.name:Name`,
      disabled: false,
      readonly: true,
      defaultValue: '',
      inherited: false,
      hint: $localize`:@@item.edit.hint.name:The item's name. Used as the primary identifier across the Cobbler API and CLI.`,
    },
    {
      formControlName: 'uid',
      inputType: CobblerInputChoices.TEXT,
      label: $localize`:@@item.edit.label.uid:UID`,
      disabled: false,
      readonly: true,
      defaultValue: '',
      inherited: false,
      hint: $localize`:@@item.edit.hint.uid:The internal unique identifier assigned by Cobbler. Never reused, even after deletion.`,
    },
    {
      formControlName: 'mtime',
      inputType: CobblerInputChoices.TEXT,
      label: $localize`:@@item.edit.label.mtime:Last modified time`,
      disabled: false,
      readonly: true,
      defaultValue: '',
      inherited: false,
      hint: $localize`:@@item.edit.hint.mtime:Timestamp of the last change to this item via the Cobbler API.`,
    },
    {
      formControlName: 'ctime',
      inputType: CobblerInputChoices.TEXT,
      label: $localize`:@@item.edit.label.ctime:Creation time`,
      disabled: false,
      readonly: true,
      defaultValue: '',
      inherited: false,
      hint: $localize`:@@item.edit.hint.ctime:Timestamp of when this item was first created in Cobbler.`,
    },
    {
      formControlName: 'built_in',
      inputType: CobblerInputChoices.CHECKBOX,
      label: $localize`:@@template.edit.label.built_in:Built-in?`,
      disabled: false,
      readonly: true,
      defaultValue: false,
      inherited: false,
      hint: $localize`:@@template.edit.hint.built_in:Whether this template ships with Cobbler itself (sourced via importlib). Built-in templates cannot be edited, deleted, or have their content changed.`,
    },
  ];
  templateEditableInputData: Array<CobblerInputData> = [
    ...cobblerItemEditableData,
    {
      formControlName: 'owners',
      inputType: CobblerInputChoices.MULTI_SELECT,
      label: $localize`:@@template.edit.label.owners:Owners`,
      disabled: true,
      readonly: false,
      defaultValue: [],
      inherited: true,
      hint: $localize`:@@template.edit.hint.owners:Cobbler user accounts allowed to manage this item. Cosmetic only — not validated against real users. Supports <<inherit>>.`,
    },
    {
      formControlName: 'template_type',
      inputType: CobblerInputChoices.TEXT,
      label: $localize`:@@template.edit.label.template_type:Template Type`,
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
      hint: $localize`:@@template.edit.hint.template_type:The template language used to render the content, e.g. "jinja2" or "cheetah". Must be one of the template providers available on the server.`,
    },
    {
      formControlName: 'tags',
      inputType: CobblerInputChoices.MULTI_SELECT,
      label: $localize`:@@template.edit.label.tags:Tags`,
      disabled: true,
      readonly: false,
      defaultValue: [],
      inherited: false,
      hint: $localize`:@@template.edit.hint.tags:Arbitrary labels for this template. Some well-known values (e.g. "active", "default", "pxe", "grub") mark a template for a special purpose inside Cobbler.`,
    },
    {
      formControlName: 'uri_schema',
      inputType: CobblerInputChoices.TEXT,
      label: $localize`:@@template.edit.label.uri_schema:URI Schema`,
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
      hint: $localize`:@@template.edit.hint.uri_schema:Where the template is sourced from: "file", "environment", or "importlib".`,
    },
    {
      formControlName: 'uri_authority',
      inputType: CobblerInputChoices.TEXT,
      label: $localize`:@@template.edit.label.uri_authority:URI Authority`,
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
      hint: $localize`:@@template.edit.hint.uri_authority:The host or authority component of the template's URI, if any.`,
    },
    {
      formControlName: 'uri_path',
      inputType: CobblerInputChoices.TEXT,
      label: $localize`:@@template.edit.label.uri_path:URI Path`,
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
      hint: $localize`:@@template.edit.hint.uri_path:Path to the template source, relative to the autoinstall templates directory for "file"-schema templates, or an environment variable name for "environment"-schema templates.`,
    },
    {
      formControlName: 'uri_query',
      inputType: CobblerInputChoices.TEXT,
      label: $localize`:@@template.edit.label.uri_query:URI Query`,
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
      hint: $localize`:@@template.edit.hint.uri_query:Optional query component of the template's URI.`,
    },
    {
      formControlName: 'uri_fragment',
      inputType: CobblerInputChoices.TEXT,
      label: $localize`:@@template.edit.label.uri_fragment:URI Fragment`,
      disabled: true,
      readonly: false,
      defaultValue: '',
      inherited: false,
      hint: $localize`:@@template.edit.hint.uri_fragment:Optional fragment component of the template's URI.`,
    },
  ];

  // Cobbler 4.0.0 keeps `uri` as a single nested option object server-side, so the flat
  // form control names above must be written back via their real nested `attribute` path
  // in `modify_template`.
  private static readonly NESTED_ATTRIBUTE_PATHS: Record<string, string[]> = {
    uri_schema: ['uri', 'schema'],
    uri_authority: ['uri', 'authority'],
    uri_path: ['uri', 'path'],
    uri_query: ['uri', 'query'],
    uri_fragment: ['uri', 'fragment'],
  };

  // Form
  name: string;
  builtIn: boolean = false;
  template: Template;
  private readonly _formBuilder = inject(FormBuilder);
  templateReadonlyFormGroup = this._formBuilder.group({});
  templateFormGroup = this._formBuilder.group({});
  isEditMode: boolean = false;

  constructor() {
    this.name = this.route.snapshot.paramMap.get('name');
    Utils.fillupItemFormGroup(
      this.templateReadonlyFormGroup,
      this.templateFormGroup,
      this.templateReadonlyInputData,
      this.templateEditableInputData,
    );
    // `content` is never present in get_template()'s response (fetched separately via
    // get_template_content()), so it isn't part of the generic CobblerInputData system.
    this.templateFormGroup.addControl(
      'content',
      new FormControl({ value: '', disabled: true }),
    );
  }

  ngOnInit(): void {
    this.refreshData();
    // Observables for inherited properties
    this.templateFormGroup
      .get('owners_inherited')
      .valueChanges.subscribe(
        this.getInheritObservable(this.templateFormGroup.get('owners')),
      );
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  getInheritObservable(
    valueControl: AbstractControl,
  ): (value: boolean) => void {
    return (value: boolean): void => {
      if (!this.isEditMode) {
        // If we are not in edit-mode we want to discard processing the event
        return;
      }
      if (value) {
        valueControl.disable();
      } else {
        valueControl.enable();
      }
    };
  }

  refreshData(): void {
    this.cobblerApiService
      .get_template(this.name, false, false, this.userService.token)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (value) => {
          this.template = value;
          this.builtIn = value.built_in;
          this.templateReadonlyFormGroup.patchValue({
            name: this.template.name,
            uid: this.template.uid,
            mtime: Utils.floatToDate(this.template.mtime).toString(),
            ctime: Utils.floatToDate(this.template.ctime).toString(),
            built_in: this.template.built_in,
          });
          this.templateFormGroup.patchValue({
            comment: this.template.comment,
            template_type: this.template.template_type,
            tags: this.template.tags,
            uri_schema: this.template.uri.schema,
            uri_authority: this.template.uri.authority,
            uri_path: this.template.uri.path,
            uri_query: this.template.uri.query,
            uri_fragment: this.template.uri.fragment,
          });
          Utils.patchFormGroupInherited(
            this.templateFormGroup,
            this.template.owners,
            'owners',
            [],
          );
          this.cobblerApiService
            .get_template_content(value.uid, this.userService.token)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe({
              next: (content) => {
                this.templateFormGroup.patchValue({
                  content: Utils.toHTML(content),
                });
              },
              error: (error) => {
                // HTML encode the error message since it originates from XML
                this._snackBar.open(
                  Utils.toHTML(error.message),
                  $localize`:@@snackbar.action.close:Close`,
                );
              },
            });
        },
        error: (error) => {
          // HTML encode the error message since it originates from XML
          this._snackBar.open(
            Utils.toHTML(error.message),
            $localize`:@@snackbar.action.close:Close`,
          );
        },
      });
  }

  removeTemplate(): void {
    this.cobblerApiService
      .remove_template(this.template.uid, this.userService.token)
      .subscribe({
        next: (value) => {
          if (value) {
            this.router.navigate(['/items', 'template']);
            return;
          }
          // HTML encode the error message since it originates from XML
          this._snackBar.open(
            $localize`:@@error.delete-failed:Delete failed! Check server logs for more information.`,
            $localize`:@@snackbar.action.close:Close`,
          );
        },
        error: (error) => {
          // HTML encode the error message since it originates from XML
          this._snackBar.open(
            Utils.toHTML(error.message),
            $localize`:@@snackbar.action.close:Close`,
          );
        },
      });
  }

  editTemplate(): void {
    this.isEditMode = true;
    this.templateFormGroup.enable();
    // Inherit inputs
    if (typeof this.template.owners === 'string') {
      this.templateFormGroup.get('owners').disable();
    }
  }

  cancelEdit(): void {
    const dialogRef = this.dialog.open(DialogBoxConfirmCancelEditComponent, {
      data: {
        name: this.name,
      },
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult === false) {
        // False means the user want's to continue
        return;
      }
      this.isEditMode = false;
      this.templateFormGroup.disable();
      this.refreshData();
    });
  }

  copyTemplate(): void {
    const dialogRef = this.dialog.open(DialogItemCopyComponent, {
      data: {
        itemType: 'Template',
        itemName: this.name,
        itemUid: '',
      },
    });

    dialogRef.afterClosed().subscribe((newItemName) => {
      if (newItemName === undefined) {
        // Cancel means we don't need to copy the template
        return;
      }
      this.cobblerApiService
        .get_template_handle(this.name)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe({
          next: (handle) => {
            this.cobblerApiService
              .copy_template(handle, newItemName, this.userService.token)
              .pipe(takeUntil(this.ngUnsubscribe))
              .subscribe({
                next: () => {
                  this.router.navigate(['/items', 'template', newItemName]);
                },
                error: (error) => {
                  // HTML encode the error message since it originates from XML
                  this._snackBar.open(
                    Utils.toHTML(error.message),
                    $localize`:@@snackbar.action.close:Close`,
                  );
                },
              });
          },
          error: (error) => {
            // HTML encode the error message since it originates from XML
            this._snackBar.open(
              Utils.toHTML(error.message),
              $localize`:@@snackbar.action.close:Close`,
            );
          },
        });
    });
  }

  saveTemplate(): void {
    let dirtyValues = Utils.deduplicateDirtyValues(
      this.templateFormGroup,
      Utils.getDirtyValues(this.templateFormGroup),
    );
    this.cobblerApiService
      .get_template_handle(this.name)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (handle) => {
          let modifyObservables: Observable<boolean>[] = [];
          dirtyValues.forEach((value, key) => {
            modifyObservables.push(
              this.cobblerApiService.modify_template(
                handle,
                TemplateEditComponent.NESTED_ATTRIBUTE_PATHS[key] ?? [key],
                value,
                this.userService.token,
              ),
            );
          });
          if (modifyObservables.length === 0) {
            // combineLatest([]) completes without ever emitting, so short-circuit to the save.
            this.persistTemplate(handle);
            return;
          }
          combineLatest(modifyObservables).subscribe({
            next: () => {
              this.persistTemplate(handle);
            },
            error: (error) => {
              this._snackBar.open(
                Utils.toHTML(error.message),
                $localize`:@@snackbar.action.close:Close`,
              );
            },
          });
        },
        error: (error) => {
          this._snackBar.open(
            Utils.toHTML(error.message),
            $localize`:@@snackbar.action.close:Close`,
          );
        },
      });
  }

  private persistTemplate(handle: string): void {
    this.cobblerApiService
      .save_template(handle, true, true, 'bypass', this.userService.token)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: () => {
          this.isEditMode = false;
          this.templateFormGroup.disable();
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

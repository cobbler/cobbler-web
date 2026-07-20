import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  inject,
} from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
} from '@angular/material/table';
import {
  debounceTime,
  filter,
  repeat,
  startWith,
  switchMap,
  take,
  takeUntil,
} from 'rxjs/operators';
import { UserService } from '../services/user.service';
import { CobblerApiService } from 'cobbler-api';
import {
  MatTree,
  MatTreeFlatDataSource,
  MatTreeFlattener,
  MatTreeNode,
  MatTreeNodeDef,
  MatTreeNodePadding,
  MatTreeNodeToggle,
} from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatIcon } from '@angular/material/icon';
import {
  MatIconButton,
  MatAnchor,
  MatButtonModule,
} from '@angular/material/button';
import { Subject, of, map, combineLatest } from 'rxjs';
import Utils, { CobblerInputChoices, CobblerInputData } from '../utils';
import { ActivatedRoute } from '@angular/router';
import { cobblerItemEditableData } from '../items/metadata';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { TextAutocompleteComponent } from '../common/text-autocomplete/text-autocomplete.component';

interface TableRow {
  key: string;
  value: any;
}

/**
 * Food data with nested structure.
 * Each node has a name and an optional list of children.
 */
interface OsNode {
  data: string | Array<TableRow>;
  children?: OsNode[];
}

/** Flat node with expandable and level information */
interface OsBreedFlatNode {
  expandable: boolean;
  data: string | Array<TableRow>;
  level: number;
}

@Component({
  selector: 'cobbler-signatures',
  imports: [
    MatTree,
    MatTreeNode,
    MatIcon,
    MatIconButton,
    MatTreeNodeToggle,
    MatTreeNodePadding,
    MatTreeNodeDef,
    MatTable,
    MatHeaderCell,
    MatCell,
    MatHeaderRow,
    MatRow,
    MatColumnDef,
    MatHeaderCellDef,
    MatCellDef,
    MatHeaderRowDef,
    MatRowDef,
    MatProgressSpinner,
    ReactiveFormsModule,
    TextAutocompleteComponent,
    MatButtonModule,
  ],
  templateUrl: './signatures.component.html',
  styleUrl: './signatures.component.scss',
})
export class SignaturesComponent implements OnInit, OnDestroy {
  userService = inject(UserService);
  private cobblerApiService = inject(CobblerApiService);
  private _snackBar = inject(MatSnackBar);
  private route = inject(ActivatedRoute);
  private targetOsVersion: string | null = null;
  private targetBreed: string | null = null;
  protected isFilterEmpty: boolean = false;

  @ViewChild('targetElement') targetTable!: ElementRef<HTMLDivElement>;

  // Bring Enum to HTML scope
  protected readonly CobblerInputChoices = CobblerInputChoices;

  // Unsubscribe
  private ngUnsubscribe = new Subject<void>();

  // Form Data
  signaturesEditableInputdata: Array<CobblerInputData> = [
    ...cobblerItemEditableData,
    {
      formControlName: 'breed',
      inputType: CobblerInputChoices.TEXT_AUTOCOMPLETE,
      label: $localize`:@@distro.edit.label.breed:Search for OS`,
      disabled: false,
      readonly: false,
      defaultValue: '',
      inherited: false,
      options: [],
    },
    {
      formControlName: 'os_version',
      inputType: CobblerInputChoices.TEXT_AUTOCOMPLETE,
      label: $localize`:@@distro.edit.label.os_version:Search for OS version`,
      disabled: false,
      readonly: false,
      defaultValue: '',
      inherited: false,
      options: [],
    },
  ];

  // Form
  private readonly _formBuilder = inject(FormBuilder);
  signaturesFormGroup = this._formBuilder.group({});
  constructor() {
    Utils.fillupSingleFormGroup(
      this.signaturesFormGroup,
      this.signaturesEditableInputdata,
    );
  }

  // Table
  columns = [
    {
      columnDef: 'key',
      header: 'Attribute',
      cell: (element: TableRow) => `${element.key}`,
    },
    {
      columnDef: 'value',
      header: 'Value',
      cell: (element: TableRow) => `${element.value}`,
    },
  ];

  displayedColumns = this.columns.map((c) => c.columnDef);

  // Tree
  private _transformer = (node: OsNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      data: node.data,
      level: level,
    };
  };

  treeControl = new FlatTreeControl<OsBreedFlatNode>(
    (node) => node.level,
    (node) => node.expandable,
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.children,
  );

  private allData: Array<OsNode> = [];
  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  // Spinner
  public isLoading = true;

  ngOnInit(): void {
    this.targetOsVersion = this.route.snapshot.queryParamMap.get('osVersion');
    this.targetBreed = this.route.snapshot.queryParamMap.get('breed');
    this.generateSignatureUiData();

    this.signaturesFormGroup
      .get('breed')
      ?.valueChanges.pipe(
        debounceTime(300),
        switchMap((breed: string) => {
          const validBreeds =
            (this.signaturesEditableInputdata.find(
              (s) => s.formControlName === 'breed',
            )?.options as string[]) ?? [];

          // If invalid breed, don't contact the API
          if (!validBreeds.includes(breed)) {
            return of([] as string[]);
          }

          return this.cobblerApiService.get_valid_os_versions_for_breed(
            breed,
            this.userService.token,
          );
        }),
        takeUntil(this.ngUnsubscribe),
      )
      .subscribe((osVersions) => {
        const osVersionInput = this.signaturesEditableInputdata.find(
          (s) => s.formControlName === 'os_version',
        );

        if (osVersionInput) {
          osVersionInput.options = osVersions;
        }
      });

    // A user was redirected for breed only (Distro, Image etc. pages)
    if (this.targetBreed) {
      (
        this.signaturesFormGroup.get('breed') as unknown as FormControl
      )?.setValue(this.targetBreed);
    }

    // A user was redirected for OS version only (Distro, Image etc. pages)
    if (this.targetOsVersion) {
      (
        this.signaturesFormGroup.get('breed') as unknown as FormControl
      )?.setValue(this.targetBreed);
      (
        this.signaturesFormGroup.get('os_version') as unknown as FormControl
      )?.setValue(this.targetOsVersion);
    }

    // Subscribe to breed and os version autocomplete inputs at the same time
    combineLatest([
      this.signaturesFormGroup
        .get('breed')!
        .valueChanges.pipe(
          startWith(this.signaturesFormGroup.get('breed')!.value),
        ),
      this.signaturesFormGroup
        .get('os_version')!
        .valueChanges.pipe(
          startWith(this.signaturesFormGroup.get('os_version')!.value),
        ),
    ])
      .pipe(debounceTime(150), takeUntil(this.ngUnsubscribe))
      .subscribe(([breedFilter, osVersionFilter]) => {
        this.applyTreeFilter(breedFilter, osVersionFilter);
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  hasChild = (_: number, node: OsBreedFlatNode) => node.expandable;

  hasOsVersion = (_: number, node: OsBreedFlatNode) =>
    typeof node.data !== 'string';

  generateSignatureUiData(): void {
    this.cobblerApiService
      .get_signatures(this.userService.token)
      .pipe(
        switchMap((value) => {
          return this.cobblerApiService
            .get_valid_breeds(this.userService.token)
            .pipe(
              map((breedList) => ({
                value,
                validBreeds: breedList,
              })),
            );
        }),
        takeUntil(this.ngUnsubscribe),
      )
      .subscribe({
        next: ({ value, validBreeds }) => {
          const breedsInput = this.signaturesEditableInputdata.find(
            (b) => b.formControlName === 'breed',
          );

          if (breedsInput) {
            breedsInput.options = validBreeds;
          }

          const newData: Array<OsNode> = [];
          for (const k in value.breeds) {
            const children: Array<OsNode> = [];
            for (const j in value.breeds[k]) {
              const osVersionData: Array<TableRow> = [];
              for (const i in value.breeds[k][j]) {
                osVersionData.push({ key: i, value: value.breeds[k][j][i] });
              }
              children.push({
                data: j,
                children: [{ data: osVersionData, children: [] }],
              });
            }
            newData.push({ data: k, children: children });
          }
          this.allData = newData;
          this.dataSource.data = newData;
          this.isLoading = false;
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

  updateSignatures(): void {
    this.isLoading = true;
    this.cobblerApiService
      .background_signature_update(this.userService.token)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (value) => {
          this.cobblerApiService
            .get_task_status(value)
            .pipe(
              repeat(),
              filter(
                (data) => data.state === 'failed' || data.state === 'complete',
              ),
              take(1),
            )
            .subscribe((value1) => {
              this.isLoading = false;
              this.generateSignatureUiData();
            });
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

  // Main algorithm to filter the tree by input values
  private applyTreeFilter(breedFilter: string, osVersionFilter: string): void {
    const breedTerm = (breedFilter ?? '').trim().toLowerCase(); // breed value (input)
    const osVersionTerm = (osVersionFilter ?? '').trim().toLowerCase(); // os version value (input)

    this.isFilterEmpty = !breedTerm && !osVersionTerm;

    if (!breedTerm && !osVersionTerm) {
      this.dataSource.data = this.allData;
      return;
    }

    const filtered: Array<OsNode> = this.allData
      .filter((breedNode) => this.breedMatches(breedNode, breedTerm))
      .map((breedNode) => this.filterBreedChildren(breedNode, osVersionTerm))
      .filter((breedNode) => breedNode.children!.length > 0);

    this.dataSource.data = filtered;
    this.treeControl.collapseAll();

    // Expand all breed nodes
    if (breedTerm) {
      this.treeControl.dataNodes
        .filter((node) => node.level === 0)
        .forEach((node) => this.treeControl.expand(node));
    }

    // Expand only the exact os version if it matches completely
    if (osVersionTerm) {
      const exactMatch = this.treeControl.dataNodes.find(
        (node) =>
          node.level === 1 &&
          typeof node.data === 'string' &&
          (node.data as string).toLowerCase() === osVersionTerm,
      );
      if (exactMatch) {
        this.treeControl.expand(exactMatch);
      }
    }
  }

  // Filter by breed name
  private breedMatches(breedNode: OsNode, breedTerm: string): boolean {
    if (!breedTerm) {
      return true;
    }
    return (breedNode.data as string).toLowerCase().includes(breedTerm);
  }

  // Filter by os version in breed
  private filterBreedChildren(
    breedNode: OsNode,
    osVersionTerm: string,
  ): OsNode {
    if (!osVersionTerm) {
      return breedNode;
    }

    const filteredChildren = (breedNode.children ?? []).filter(
      (osVersionNode) =>
        (osVersionNode.data as string).toLowerCase().includes(osVersionTerm),
    );

    return { ...breedNode, children: filteredChildren };
  }

  clearFilter(): void {
    (this.signaturesFormGroup.get('breed') as unknown as FormControl)?.setValue(
      '',
    );
    (
      this.signaturesFormGroup.get('os_version') as unknown as FormControl
    )?.setValue('');
  }
}

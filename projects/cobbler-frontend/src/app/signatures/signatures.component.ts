import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import {Component, OnDestroy, OnInit} from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { MatList, MatListItem } from '@angular/material/list';
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
import {filter, repeat, take, takeUntil} from 'rxjs/operators';
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
import { MatIconButton } from '@angular/material/button';
import {Subject} from "rxjs";

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
  standalone: true,
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
    MatDivider,
    AsyncPipe,
    MatList,
    MatListItem,
    MatProgressSpinner,
    NgForOf,
    NgIf,
  ],
  templateUrl: './signatures.component.html',
  styleUrl: './signatures.component.scss',
})
export class SignaturesComponent implements OnInit, OnDestroy {
  // Unsubscribe
  private ngUnsubscribe = new Subject<void>();

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
  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  // Spinner
  public isLoading = true;

  constructor(
    public userService: UserService,
    private cobblerApiService: CobblerApiService,
    private _snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.generateSignatureUiData();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next()
    this.ngUnsubscribe.complete()
  }

  hasChild = (_: number, node: OsBreedFlatNode) => node.expandable;

  hasOsVersion = (_: number, node: OsBreedFlatNode) =>
    typeof node.data !== 'string';

  generateSignatureUiData(): void {
    this.cobblerApiService.get_signatures(this.userService.token)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
      (value) => {
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
        this.dataSource.data = newData;
        this.isLoading = false;
      },
      (error) => {
        // HTML encode the error message since it originates from XML
        this._snackBar.open(this.toHTML(error.message), 'Close');
      },
    );
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

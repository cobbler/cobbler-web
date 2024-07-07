import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, Input, OnInit } from '@angular/core';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
  MatTreeModule,
} from '@angular/material/tree';

/**
 * Food data with nested structure.
 * Each node has a name and an optional list of children.
 */
interface ObjectNode {
  name: string;
  value: any;
  children?: ObjectNode[];
}

/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

@Component({
  selector: 'cobbler-viewable-tree',
  templateUrl: './viewable-tree.component.html',
  styleUrls: ['./viewable-tree.component.scss'],
  standalone: true,
  imports: [MatTreeModule],
})
export class ViewableTreeComponent implements OnInit {
  @Input() inputObject: object = {};
  viewableTreeControl = new FlatTreeControl<ExampleFlatNode>(
    (node) => node.level,
    (node) => node.expandable
  );

  private _transformer = (node: ObjectNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      value: node.value,
      level: level,
    };
  };

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.children
  );

  dataSource = new MatTreeFlatDataSource(
    this.viewableTreeControl,
    this.treeFlattener
  );

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  constructor() {}

  inputLength(inputObject: object): number {
    return Object.keys(inputObject).length;
  }

  private transformObject(inputObject: object): ObjectNode[] {
    const resultStructure = [];
    let children = [];
    Object.keys(inputObject).forEach((key) => {
      if (
        !Array.isArray(inputObject[key]) &&
        typeof inputObject[key] === 'object'
      ) {
        children = this.transformObject(inputObject[key]);
      }
      resultStructure.push({
        name: key,
        value: inputObject[key],
        children: children,
      });
    });
    return resultStructure;
  }

  ngOnInit(): void {
    this.dataSource.data = this.transformObject(this.inputObject);
  }
}

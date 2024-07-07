import { Component, OnInit } from '@angular/core';
import { MatTreeModule } from '@angular/material/tree';

@Component({
  selector: 'cobbler-editable-tree',
  templateUrl: './editable-tree.component.html',
  styleUrls: ['./editable-tree.component.scss'],
  standalone: true,
  imports: [MatTreeModule],
})
export class EditableTreeComponent {

  constructor() { }

}

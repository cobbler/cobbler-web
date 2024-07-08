import {Component} from '@angular/core';
import {DataDistroService} from '../../services/data-distro.service';
import { RouterOutlet } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import {MatInputModule} from "@angular/material/input";
import {MatTableModule} from "@angular/material/table";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'cobbler-distros',
  templateUrl: './distros.component.html',
  styleUrls: ['./distros.component.css'],

  standalone: true,
  imports: [RouterOutlet, MatFormFieldModule, MatTabsModule, MatInputModule, MatTableModule, MatButtonModule],
})
export class DistrosComponent {
  // Distro object contains [0-5] not editable
  // [6-24] items below
  // There can be more than one distro object
  arch = [];
  autoinstall = [];
  bFiles = [];
  bLoader = [];
  breed = [];
  comment = [];
  fFiles = [];
  initrd = [];
  kernel = [];
  reboInitrd = [];
  reboKernel = [];
  kernelOptions = [];
  kOptPost = [];
  mngClass = [];
  name = [];
  osVersion = [];
  owners = [];
  rhMngKey = [];
  tmpltFiles = [];
  // persistant use items:
  datatable = [];
  ActiveElement = 'description';
  displayedColumns = ['position', 'type', 'version','update']
  displayedColumns2 = ['position', 'item', 'description']

  constructor(service: DataDistroService) {
    /*USE
    --------
    for items of tabledata[i]:
    [0] = python variable name
    [1] = data about this item
    [2] = number = 0
    [3] = description
    [4] = boolean | True
    [5] = use case
    [6] = function call | 0
    [7] = data type
    --------
    Example:
    to get and display arch type:
    {{datatable[0][7]}}
    */
    // Linter throws errors on these variable names.
    // These variable names are set in the data, but can be changed for linter purposes
    this.arch = service.get_item('arch'); // 0
    this.autoinstall = service.get_item('autoinstall'); // 1
    this.bFiles = service.get_item('b_files'); // 2
    this.bLoader = service.get_item('b_loader'); // 3
    this.breed = service.get_item('breed'); // 4
    this.comment = service.get_item('comment'); // 5
    this.fFiles = service.get_item('f_files'); // 6
    this.initrd = service.get_item('initrd'); // 7
    this.kernel = service.get_item('kernel'); // 8
    this.reboInitrd = service.get_item('rebo_initrd'); // 9
    this.reboKernel = service.get_item('rebo_kernel'); // 10
    this.kernelOptions = service.get_item('kernel_options'); // 11
    this.kOptPost = service.get_item('k_opt_post'); // 12
    this.mngClass = service.get_item('mng_class'); // 13
    this.name = service.get_item('name'); // 14
    this.osVersion = service.get_item('os_version'); // 15
    this.owners = service.get_item('owners'); // 16
    this.rhMngKey = service.get_item('rh_mng_key'); // 17
    this.tmpltFiles = service.get_item('tmplt_files'); // 18

    this.datatable = [this.arch, this.autoinstall, this.bFiles, this.bLoader, this.breed, this.comment, this.fFiles,
      this.initrd, this.kernel, this.reboInitrd, this.reboKernel, this.kernelOptions, this.kOptPost,
      this.mngClass, this.name, this.osVersion, this.owners, this.rhMngKey, this.tmpltFiles];
  }

  show(name: string): void {
    this.ActiveElement = name;
    // console.log(this.ActiveElement)
  }
}

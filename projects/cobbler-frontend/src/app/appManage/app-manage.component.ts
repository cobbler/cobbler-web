import {Component} from '@angular/core';
import {GetObjService} from '../services/get-obj.service';

@Component({
  selector: 'cobbler-app-manage',
  templateUrl: './app-manage.component.html',
  styleUrls: ['./app-manage.component.css'],
  standalone: true,
})
export class AppManageComponent {
  username: string;
  currentItem: string;
  currentObjs;
  saveObj;


  constructor(service: GetObjService) {
    const user = window.sessionStorage.getItem('user');
    const item = window.sessionStorage.getItem('CurrentItem');
    this.currentObjs = service.getITEMS();
    // console.log(`Current objects: ${this.current_objs}.  Type=`, typeof this.current_objs)
    if (user) {
      this.username = user;
    }

    if (item) {
      this.currentItem = item;
    } else {
      // console.log(`item not found: ${item}`)
      this.currentItem = 'No Item has been selected.';
    }
    this.saveObj = (value) => {
      // console.log("saving current value in service")
      service.name = value;
    };
  }

  // TODO: Find a way to also save this in current service
  save(index): void {
    // console.log('saving item')
    // let size = this.current_objs.length
    const current = this.currentObjs[index];
    this.currentItem = current;
    this.saveObj(current);
  }
}

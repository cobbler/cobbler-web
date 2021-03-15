import {Component} from '@angular/core';
import {GetObjService} from '../services/get-obj.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-current-obj',
  templateUrl: './current-obj.component.html',
  styleUrls: ['./current-obj.component.css']
})
export class CurrentOBJComponent {
  currentitem;
  subscription: Subscription;

  constructor(public service: GetObjService) {
    // currentitem => returns undefined on refresh??
    const sessionItem = window.sessionStorage.getItem('CurrentItem');
    this.subscription = this.service.CurrentITEM.subscribe(next => {
      if (next) {
        this.currentitem = 'Current Item: ' + next;
      } else {
        this.currentitem = 'Current Item: ' + sessionItem;
      }
    });
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';

/*
Item returned from XMLrpc will be an object that
houses a list of all the current mock data.
  Each item will have ['Distros', 'Profiles', 'Systems',
                       'Repos', 'Images', 'Templates',
                       'Snippets', 'Management Classes',
                       'Settings', 'Packages', 'Files']
  Example of component data:
  Management Classes : { MngclassesService }
  FIELDS = [
    # non-editable in UI (internal)
    FIELDS[0-4]

    FIELDS[5-11]
    # editable in UI
    0-["class_name", "", 0, "Class Name", True, "Actual Class Name (leave blank to use the name field)", 0, "str"],
    1-["comment", "", 0, "Comment", True, "Free form text description", 0, "str"],
    2-["files", [], 0, "Files", True, "File resources", 0, "list"],
    3-["name", "", 0, "Name", True, "Ex: F10-i386-webserver", 0, "str"],
    4-["owners", "SETTINGS:default_ownership", "SETTINGS:default_ownership", "Owners", True, "Owners list for
       authz_ownership (space delimited)", 0, "list"],
    5-["packages", [], 0, "Packages", True, "Package resources", 0, "list"],
    6-["params", {}, 0, "Parameters/Variables", True, "List of parameters/variables", 0, "dict"],
]

See docs-additonal for each components data structure.
"../docs-additonal/component-schema.md"

*/

@Injectable({
  providedIn: 'root',
})
export class GetObjService {
  MockObject = [];
  MockValues = ['Item 0x1', 'Item 1x2', 'Item 2x3'];
  // If MockObjname is not left blank/undefined, the value hear overrides the session value on construction.
  MockObjname = window.sessionStorage.getItem('CurrentItem');

  // ERROR is thrown if MockObjname  is Left undefined before constructor

  public CurrentITEM: BehaviorSubject<string> = new BehaviorSubject<string>(
    this.MockObjname,
  );
  CurrentITEM$: Observable<string> = this.CurrentITEM.asObservable();

  constructor() {
    // Add authorization check??
    const current = window.sessionStorage.getItem('CurrentItem');

    if (current) {
      this.MockObjname = current;
    }

    window.sessionStorage.setItem(
      'CobblerITEMS',
      JSON.stringify(this.MockValues),
    );
  }

  getITEMS(): string[] {
    return this.MockValues;
  }

  set name(item: string) {
    window.sessionStorage.setItem('CurrentItem', item);
    const sessionItem = window.sessionStorage.getItem('CurrentItem');
    if (sessionItem) {
      this.MockObjname = sessionItem;
    }
    this.CurrentITEM.next(item);
    // let message = `Current Item is set to: ${this.MockObjname}`
    /// console.log(message)
    // window.sessionStorage.setItem('CurrentItem', this.MockObjname)
  }
}

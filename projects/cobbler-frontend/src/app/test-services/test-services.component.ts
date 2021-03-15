import {Component, OnInit} from '@angular/core';
import {GetXMLService} from '../services/get-xml.service';

@Component({
  selector: 'app-test-services',
  templateUrl: './test-services.component.html',
  styleUrls: ['./test-services.component.css']
})

export class TestServicesComponent implements OnInit {
  xmlDoc: any;

  constructor(private service: GetXMLService) {
  }

  populateResponse(): void {
    const fullXML = document.getElementById('fullXML');
    // let nodearr = fullXML.getElementsByTagName('notes')
    // console.log(nodearr)
    const doc = this.xmlDoc;
    const nodearr = doc.getElementsByTagName('notes');
    // console.log(nodearr)

    // Disable below because we are iterating over a HTML Collection
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < nodearr.length; i++) {
      const item = nodearr[i];
      // let nodeItem = item.getElementsByTagName('note')
      // nodeItem.classList.add('childnode')
      // console.log(typeof item)
      fullXML.appendChild(item);
    }
  }

  async readXML(): Promise<void> {
    this.xmlDoc = await this.service.getXMLDoc();
  }

  ngOnInit(): void {
    this.readXML();
  }
}

/*constructor(private _http: Http) {
    _http.get(this.xmlurl)
      .subscribe(response => {

//console.log(response)
let content = response.text()
parseString(content, function (err, result) {
  console.log(result)

});

      }, error => {
  if (error.status == 404) {
    alert("This post has already been deleted")
  }
  else {
    alert("Unexpected Error.")
  }
})
  } //end constructor
 *
 */

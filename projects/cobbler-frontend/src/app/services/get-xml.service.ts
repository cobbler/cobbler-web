import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

/* This just retrieves the document from the API call and returns the document */
@Injectable({
  providedIn: 'root'
})
export class GetXMLService {
  // mock data for simulation and testing:
  private xmlurl = 'https://run.mocky.io/v3/4545a21b-f980-4ada-a327-bfbe851c9c03';
  // end mock
  // **********************************************
  // Need actual xmlrpc and data schema to start working on components
  // *********************************************

  constructor(private http: HttpClient) {
  } // end constructor

  getXMLDoc(): Promise<any> {
    return new Promise((resolve, reject) => {
        this.http.get<string>(this.xmlurl)
          .subscribe(response => {

            // console.log(response)
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(response, 'application/xml');
            console.log('promise completed');
            // console.log(xmlDoc)
            // let dataTEST = "THIS IS DATA FROM THE PROMISE"
            resolve(xmlDoc);

            // return this.xmlDoc
            // place a way to check that response is not error before assigning to xmlItems
          }, error => {
            if (error.status === 404) {
              alert('This post has already been deleted');
            } else {
              alert('Unexpected Error.');
            }
          });

      }
    );
  }

  // for each component we can send from the XML doc the data needed by retrieving it
  // from the doc with document.getElementsByTagName('data_011')
}

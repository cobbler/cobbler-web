# Notes

## 01/28/2021 -Nellie

Added a `BehaviorSubject` and `Observable` to the AuthenticationComponent
This way we can use the .subscribe to recieve the status of the user.
Perhaps in future code, have a username/role/key-password stored in this service

references:

- <https://stackoverflow.com/questions/46047854/how-to-update-a-component-without-refreshing-full-page-angular>
- <https://stackoverflow.com/questions/50867132/behaviorsubject-not-working-angular-5>

On refresh, the user is 'logged out'
Question: Do we want this behavior, or let the user data/logged in stay active on the local host?
reference for saving login status:
<https://stackoverflow.com/questions/52659065/angular-authlistener-how-to-keep-a-user-logged-in-after-page-refreshes>

## 01/19/2020 -Nellie

ERROR: Can not resolve 'https':
Go to C:\<user path>\COBBLER\node_modules\@angular-devkit\build-angular\src\webpack\configs\browser.js
change the last item 'node: false'
to: node: {http:true,https:true,url:true}

refernce: https://github.com/baalexander/node-xmlrpc/issues/151
See: ibuioli's comment

javascript file:
src/assets/js/testXML.js
funtion name: alertALive()

Add into angular.json:
```json
{
    "styles": [ "src/styles.css" ],
    "scripts": ["src/assets/js/testXML.js"]
},
"configurations": { "..." }
```

To use in component:

```typescript
import * as jsalive from 'src/assets/js/testXML.js'
declare const alertAlive: any;
```

then:
```typescript
jsalive.alertAlive();
```

!!added button to `login.html` to test

```shell
npm install
ng update
```

The button in my hello-world app returns in the alert, an [Object object] as client.
I'm not sure why the button isn't working in this.
The export error appears in my hello-world app also.

Required:
```shell
npm install @angular/http@latest
```

# Problems
## 01/14/2021 -Nellie Tobey
line 22 of test-service.component.ts:
While the doc is loaded in the promise as indicated by the console.log*,
what is being returned in the async is still 'undefined'.


*line 30 in <app/services/get-xml.service.ts>

------------------- Main Notes ---------------------------
All data will come from a XMLrpc API
Working on how to retrieve data.
Each menu tab in the users management page will need a component.
That component will 'properly' display the data specific to that component.

The src/app/services will hold the API call and control the getting of the data.
I may have the service transform the data to json.
So far I have been unsuccessful at getting the tools below to translate XML into JSON.
Is there an easier way? Why can't the XML data be used as-is? Is there a way?


   ----- X M L  to  J S O N ------


mock server for xml : <https://designer.mocky.io/design>

mock address: <https://run.mocky.io/v3/c75a2285-0067-4a1e-a82c-e2c41e0647ff>
to delete mock: <https://designer.mocky.io/manage/delete/c75a2285-0067-4a1e-a82c-e2c41e0647ff/8F2JgBS0GpqvJmOOjgGjhxLK3Q64IYFaNFXh>

---WORKING usage example in 'hello-world' app:

```typescript
import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { NgxXml2jsonService } from 'ngx-xml2json';


@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})

export class PostsComponent {
  posts: any[];
  private url = 'https://jsonplaceholder.typicode.com/posts';
  // Updated :
  private xmlurl = 'https://run.mocky.io/v3/4545a21b-f980-4ada-a327-bfbe851c9c03';
  private mockXML = `<note><to>User</to><from>Library</from><heading>Message</heading><body>Some XML to convert to JSON!</body></note>`;


  constructor(private ngxXml2jsonService: NgxXml2jsonService, http: Http) {
    //const serializer = new XMLSerializer();

    //updated: mock data is coming through
    http.get(this.xmlurl)

      .subscribe(response => {
        console.log(typeof response)
        let newsXML = JSON.stringify(response)
        var parser = new DOMParser();
        var xml = parser.parseFromString(newsXML, 'text/xml');
        var obj = this.ngxXml2jsonService.xmlToJson(xml);
        console.log(obj);
        console.log(newsXML)


        //let xmlStr = serializer.serializeToString(response);
        //console.log(xmlStr)

      });
  }
}
```

******  NPM  *******

- possible alternative: angular-xmlrpc (--save)
- link: <https://github.com/ITrust/angular-xmlrpc>
- link: <https://www.npmjs.com/package/xml2json>

```shell
npm install xml2json
npm install timers
```

--- USE ----
```typescript
var parser = require('xml2json');

var xml = "<foo attr=\"value\">bar</foo>";
console.log("input -> %s", xml)

// xml to json
var json = parser.toJson(xml);
console.log("to json -> %s", json);

// json to xml
var xml = parser.toXml(json);
console.log("back to xml -> %s", xml)
```

--- API ---

```typescript
parser.toJson(xml, options);
parser.toXml(json);
```

 ******    Angular    *******

Angular xml => json:

link: https://www.npmjs.com/package/ngx-xml2json

--- Install ---

```shell
npm install ngx-xml2json --save
```

 --- Usage Example: ----
```typescript
import { Component } from '@angular/core';
import { NgxXml2jsonService } from 'ngx-xml2json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  xml = `<note><to>User</to><from>Library</from><heading>Message</heading><body>Some XML to convert to JSON!</body></note>`;
  constructor(private ngxXml2jsonService: NgxXml2jsonService) {
    const parser = new DOMParser();
    const xml = parser.parseFromString(this.xml, 'text/xml');
    const obj = this.ngxXml2jsonService.xmlToJson(xml);
    console.log(obj);

  }

}
```
   ---    Other   installs   ------

bootstrap*
$ npm install @angular/http@latest

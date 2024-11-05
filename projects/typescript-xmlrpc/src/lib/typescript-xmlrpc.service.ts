import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { serializeMethodCall } from './serializer';
import { Utils } from './utils';
import {
  MethodFault,
  MethodResponse,
  XmlRpcArray,
  XmlRpcStruct,
  XmlRpcTypes,
} from './xmlrpc-types';
import { deserialize } from './deserializer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const BODY = 'body';
const TEXT = 'text';

@Injectable({
  providedIn: 'root',
})
export class AngularXmlrpcService {
  private readonly http: HttpClient;
  private url: URL;
  private headers: object;

  static instanceOfMethodResponse(object: object): object is MethodResponse {
    return Utils.instanceOfMethodResponse(object);
  }

  static instanceOfMethodFault(object: object): object is MethodFault {
    return Utils.instanceOfMethodFault(object);
  }

  static instanceOfXmlRpcStruct(object: XmlRpcTypes): object is XmlRpcStruct {
    return Utils.instanceOfXmlRpcStruct(object);
  }

  static instanceOfXmlRpcArray(object: XmlRpcTypes): object is XmlRpcArray {
    return Utils.instanceOfXmlRpcArray(object);
  }

  constructor(http: HttpClient) {
    this.headers = {};
    this.url = new URL('http://localhost');
    this.http = http;
  }

  /**
   * Call this method before any other to configure the service. Otherwise other methods may behave incorrectly.
   *
   * @param url The URL of the XMLRPC Service.
   */
  configureService(url: URL): void {
    this.url = url;
  }

  /**
   * Makes an XML-RPC call to the server specified by the constructor's options.
   *
   * @param method The method name.
   * @param params Params to send in the call.
   * @param encoding The encoding to append to the generated XML document.
   */
  methodCall(
    method: string,
    params?: Array<XmlRpcTypes>,
    encoding?: string,
  ): Observable<MethodResponse | MethodFault> {
    const xml = serializeMethodCall(method, params, encoding);
    const httpOptions = new HttpHeaders();
    httpOptions.set('Content-Type', 'text/xml');
    httpOptions.set('Accept', 'text/xml');
    const options: object = {
      headers: httpOptions,
      reportProgress: false,
      observe: BODY,
      responseType: TEXT,
      withCredentials: false,
    };

    return this.http.post<string>(this.url.toString(), xml, options).pipe(
      map<string, MethodResponse | MethodFault>((source: string) => {
        return deserialize(source);
      }),
    );
  }
}

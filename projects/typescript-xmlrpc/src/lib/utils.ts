import {
  MethodFault,
  MethodResponse,
  XmlRpcArray,
  XmlRpcStruct,
  XmlRpcTypes,
} from './xmlrpc-types';

export class Utils {
  static instanceOfMethodResponse(object: object): object is MethodResponse {
    return 'value' in object;
  }

  static instanceOfMethodFault(object: object): object is MethodFault {
    return 'faultCode' in object && 'faultString' in object;
  }

  static instanceOfXmlRpcStruct(object: XmlRpcTypes): object is XmlRpcStruct {
    return (
      object !== null &&
      typeof object === 'object' &&
      Object.keys(object).length === 1 &&
      'members' in object
    );
  }

  static instanceOfXmlRpcArray(object: XmlRpcTypes): object is XmlRpcArray {
    return (
      object !== null &&
      typeof object === 'object' &&
      Object.keys(object).length === 1 &&
      'data' in object
    );
  }
}

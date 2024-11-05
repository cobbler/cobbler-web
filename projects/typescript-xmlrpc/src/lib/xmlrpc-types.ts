export type XmlRpcTypes =
  | number
  | boolean
  | string
  | Date
  | ArrayBuffer
  | XmlRpcStruct
  | Map<string, XmlRpcTypes>
  | XmlRpcArray
  | Array<XmlRpcTypes>;

export interface MethodResponse {
  value: XmlRpcTypes;
}

export interface MethodFault {
  faultCode: number;
  faultString: string;
}

export interface XmlRpcArray {
  data: Array<XmlRpcTypes>;
}

export interface XmlRpcStruct {
  members: Array<Member>;
}

export interface Member {
  name: string;
  value: XmlRpcTypes;
}

export interface Param {
  value: XmlRpcTypes;
}

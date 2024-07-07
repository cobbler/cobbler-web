/**
 * This method is a meta-method which combines module private functions to generate a structured object from the XML-RPC
 * string handed to it.
 *
 * @param content The content of XML which is to be parsed.
 */
import {Member, MethodFault, MethodResponse, Param, XmlRpcStruct, XmlRpcArray, XmlRpcTypes} from './xmlrpc-types';
import {applicationError} from './constants';

function deserialize(content: string): MethodResponse | MethodFault {
  const document = deserializeResponse(content);
  if (document.getElementsByTagName('parsererror').length > 0) {
    return applicationError;
  }
  // Try conversion and if it fails for any reason just return the generic error
  try {
    return convertDomToObject(document);
  } catch (e) {
    console.log(e);
    return applicationError;
  }
}

/**
 * Deserializes a response of the XMLRPC API into a XML Document
 *
 * @param content The content of XML which is to be parsed.
 * @throws Error with a description of what Sax says is invalid
 */
function deserializeResponse(content: string): Document {
  const parser = new DOMParser();
  return parser.parseFromString(content, 'application/xml');
}

/**
 * This method converts any document either in a meaningful response object or throws an error.
 *
 * @param document The document to convert.
 */
function convertDomToObject(document: Document): MethodResponse | MethodFault {
  return convertMethodResponse(document);
}

function convertMethodResponse(document: Document): MethodResponse | MethodFault {
  if (document.documentElement.tagName !== 'methodResponse') {
    throw Error('methodResponse was not the root-Element!');
  }
  const methodResponse = document.documentElement;
  const methodReponseChildren = methodResponse.children;
  if (methodReponseChildren.length !== 1) {
    throw Error('methodResponse needs to have exactly one Element!');
  }
  switch (methodReponseChildren[0].tagName) {
    case 'params':
      const params = convertParams(methodReponseChildren[0]);
      if (params.length === 1) {
        return params[0];
      }
      throw new Error('params in methodResponse are only allowed to have a single param!');
    case 'fault':
      return convertFault(methodReponseChildren[0]);
    default:
      throw new Error('Unsupported XML Tag Name for the children of methodResponse!');
  }
}

function convertParams(element: Element): Array<Param> {
  if (element.tagName !== 'params') {
    throw new Error('Given Element was no params DOM Node! Got \'' + element.tagName + '\' instead.');
  }
  const methodResponseChildren = element.children;
  if (methodResponseChildren.length !== 1) {
    throw Error('params needs to have a single child!');
  }
  if (methodResponseChildren[0].tagName !== 'param') {
    throw Error('Tag name of the single child of params needs to be param!');
  }
  const params: Array<Param> = [];
  // Below ignore is due to: https://stackoverflow.com/a/22754453/4730773
  for (let i = 0; i < methodResponseChildren.length; i++) {
    params.push(convertParam(methodResponseChildren[i]));
  }
  return params;
}

function convertFault(element: Element): MethodFault {
  if (element.tagName !== 'fault') {
    throw new Error('Given Element was no fault DOM Node! Got \'' + element.tagName + '\' instead.');
  }
  const faultChildren = element.children;
  if (faultChildren.length !== 1) {
    throw Error('fault needs to have a single child!');
  }
  if (faultChildren[0].tagName !== 'value') {
    throw Error('Tag name of the single child of fault needs to be value!');
  }
  const faultStruct = convertValue(faultChildren[0]) as XmlRpcStruct;
  if (!('members' in faultStruct)) {
    throw new Error('The converted value was not of the XMLRPC type struct! Got instead \'' + faultStruct + '\'.');
  }
  if (faultStruct.members.length !== 2) {
    throw new Error('The struct of a fault needs to have exactly two members!');
  }
  if (faultStruct.members[0].name === 'faultCode' && faultStruct.members[1].name === 'faultString') {
    return {faultCode: faultStruct.members[0].value as number, faultString: faultStruct.members[1].value as string};
  }
  throw new Error(
    'The keys faultCode & faultString were not found in the struct converted from the passed data! Got instead \''
    + faultStruct + '\'.');
}

function convertParam(element: Element): Param {
  if (element.tagName !== 'param') {
    throw new Error('Given Element was no param DOM Node! Got \'' + element.tagName + '\' instead.');
  }
  const paramChildren = element.children;
  if (paramChildren.length !== 1) {
    throw Error('param needs to have a single child!');
  }
  if (paramChildren[0].tagName !== 'value') {
    throw Error('Tag name of the single child of param needs to be value!');
  }
  return {value: convertValue(paramChildren[0])};
}

function convertMember(element: Element): Member {
  if (element.tagName !== 'member') {
    throw new Error('Given Element was no member DOM Node! Got \'' + element.tagName + '\' instead.');
  }
  const memberChildren = element.children;
  if (memberChildren.length !== 2) {
    throw new Error('A member needs to have exactly two child objects!');
  }
  let name = '';
  let value: XmlRpcTypes = '';
  if (memberChildren[0].tagName === 'name' && memberChildren[1].tagName === 'value') {
    name = convertName(memberChildren[0]);
    value = convertValue(memberChildren[1]);
  } else if (memberChildren[0].tagName === 'value' && memberChildren[1].tagName === 'name') {
    value = convertValue(memberChildren[0]);
    name = convertName(memberChildren[1]);
  } else {
    throw new Error('name & value positions were not 0 or 1, thus the member can\'t be reliably parsed!');
  }
  return {name, value};
}

function convertValue(element: Element): XmlRpcTypes {
  if (element.tagName !== 'value') {
    throw new Error('Given Element was no value DOM Node! Got \'' + element.tagName + '\' instead.');
  }
  const valueChildren = element.children;
  if (valueChildren.length !== 1) {
    throw Error('param needs to have a single child!');
  }
  switch (valueChildren[0].tagName) {
    case 'i4':
    case 'int':
      const possibleInt = parseInt(valueChildren[0].innerHTML, 10);
      if (typeof possibleInt === 'number') {
        return possibleInt;
      }
      throw new Error('value of type int was impossible to parse to an int!');
    case 'boolean':
      if (valueChildren[0].innerHTML === '1') {
        return true;
      } else if (valueChildren[0].innerHTML === '0') {
        return false;
      } else {
        throw new Error('Boolean in XMLRPC must be 0 or 1!');
      }
    case 'string':
      return valueChildren[0].innerHTML;
    case 'double':
      return parseFloat(valueChildren[0].innerHTML);
    case 'dateTime.iso8601':
      return new Date(valueChildren[0].innerHTML);
    case 'base64':
      return new Buffer(valueChildren[0].innerHTML);
    case 'struct':
      return convertStruct(valueChildren[0]);
    case 'array':
      return convertArray(valueChildren[0]);
    default:
      // eslint-disable-next-line max-len
      throw Error('Tag name of the single child of value needs to be i4, int, boolean, string, double, dateTime.iso8607, base64, struct or array!');
  }
}

function convertArray(element: Element): XmlRpcArray {
  if (element.tagName !== 'array') {
    throw new Error('Given Element was no struct DOM Node! Got \'' + element.tagName + '\' instead.');
  }
  const arrayChildren = element.children;
  if (arrayChildren.length !== 1) {
    throw new Error('An array needs to have exactly one child object!');
  }
  if (arrayChildren[0].tagName !== 'data') {
    throw new Error('Given Element was no data DOM Node of type array! Got \'' + element.tagName + '\' instead.');
  }
  const result: XmlRpcArray = { data: []};
  const dataChildren = arrayChildren[0].children;
  // Below ignore is due to: https://stackoverflow.com/a/22754453/4730773
  for (let i = 0; i < dataChildren.length; i++) {
    result.data.push(convertValue(dataChildren[i]));
  }
  return result;
}

function convertStruct(element: Element): XmlRpcStruct {
  if (element.tagName !== 'struct') {
    throw new Error('Given Element was no struct DOM Node! Got \'' + element.tagName + '\' instead.');
  }
  const collection = element.children;
  const result: Array<Member> = [];
  // Below ignore is due to: https://stackoverflow.com/a/22754453/4730773
  for (let i = 0; i < collection.length; i++) {
    result.push(convertMember(collection[i]));
  }
  return {members: result};
}

function convertName(element: Element): string {
  if (element.tagName !== 'name') {
    throw new Error('Given Element was no name DOM Node! Got \'' + element.tagName + '\' instead.');
  }
  return element.innerHTML;
}

export {deserialize};

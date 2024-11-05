import { create } from 'xmlbuilder2';
import { DateFormatter } from './date_formatter';
import { XMLBuilder } from 'xmlbuilder2/lib/interfaces';
import { Utils } from './utils';
import { XmlRpcArray, XmlRpcStruct, XmlRpcTypes } from './xmlrpc-types';

/**
 * Creates the XML for an XML-RPC method call.
 *
 * @param method   - The method name.
 * @param params   - Params to pass in the call. If none are needed this parameter can be skipped.
 * @param encoding - The encoding which is added to the XML document. If no specific is required just skip it.
 */
export function serializeMethodCall(
  method: string,
  params?: Array<XmlRpcTypes>,
  encoding?: string,
): string {
  let xml: XMLBuilder;

  if (encoding) {
    xml = create({ encoding });
  } else {
    xml = create();
  }

  const methodCall = xml.ele('methodCall');
  methodCall.ele('methodName').txt(method);

  if (params) {
    const methodParams = methodCall.ele('params');

    params.forEach((param: XmlRpcTypes) => {
      serializeValue(param, methodParams.ele('param'));
    });
  }

  // Includes the <?xml ...> declaration
  return xml.doc().toString();
}

function serializeValue(value: XmlRpcTypes, xml: XMLBuilder): void {
  switch (typeof value) {
    case 'boolean':
      appendBoolean(value, xml);
      break;
    case 'string':
      appendString(value, xml);
      break;
    case 'number':
      appendNumber(value, xml);
      break;
    case 'object':
      if (Object.prototype.toString.call(value) === '[object Date]') {
        // Why don't we use instanceof for Date? - https://stackoverflow.com/a/643827/4730773
        appendDatetime(value as Date, xml);
        break;
      }
      if (ArrayBuffer.isView(value)) {
        appendBuffer(value as ArrayBuffer, xml);
        break;
      } else {
        if (Utils.instanceOfXmlRpcArray(value)) {
          appendArray(
            value as XmlRpcArray,
            xml.ele('value').ele('array').ele('data'),
          );
          break;
        }
        if (Array.isArray(value)) {
          appendArray(
            { data: value },
            xml.ele('value').ele('array').ele('data'),
          );
          break;
        }
        if (value instanceof Map) {
          const xmlrpcstruct = { members: [] };
          for (let [key, val] of value) {
            xmlrpcstruct.members.push({ name: key, value: val });
          }
          appendStruct(xmlrpcstruct, xml.ele('value').ele('struct'));
          break;
        }
        if (Utils.instanceOfXmlRpcStruct(value)) {
          appendStruct(value as XmlRpcStruct, xml.ele('value').ele('struct'));
          break;
        }
        throw new Error('Type of value node could not be detected!');
      }
    default:
      break;
  }
}

function appendArray(value: XmlRpcArray, xml: XMLBuilder): void {
  value.data.forEach((element) => {
    serializeValue(element, xml);
  });
}

function appendStruct(value: XmlRpcStruct, xml: XMLBuilder): void {
  value.members.forEach((element) => {
    const valueXml = create();
    serializeValue(element.value, valueXml);
    xml.ele('member').ele('name').txt(element.name).up().import(valueXml);
  });
}

/**
 * This method appends to a node a boolean in XMLRPC style. This means that `true` is converted to `1` and `false` is
 * converted to `0`.
 *
 * @param value Either true or false.
 * @param xml The parent node the value should be appended to.
 */
function appendBoolean(value: boolean, xml: XMLBuilder): void {
  xml
    .ele('value')
    .ele('boolean')
    .txt(value ? '1' : '0');
}

/**
 * This method appends to a node a string in XMLRPC style.
 *
 * @param value The string to append. Escaping if needed is done by XMLBuilder2
 * @param xml The parent node the value should be appended to.
 */
function appendString(value: string, xml: XMLBuilder): void {
  xml.ele('value').ele('string').txt(value);
}

function appendNumber(value: number, xml: XMLBuilder): void {
  if (value % 1 === 0) {
    xml.ele('value').ele('int').txt(value.toString());
  } else {
    xml.ele('value').ele('double').txt(value.toString());
  }
}

function appendDatetime(value: Date, xml: XMLBuilder): void {
  const myDateFormatter = new DateFormatter(true, false, false, false, false);
  xml
    .ele('value')
    .ele('dateTime.iso8601')
    .txt(myDateFormatter.encodeIso8601(value));
}

function arrayBufferToBase64(buffer: ArrayBuffer) {
  // Source: https://stackoverflow.com/a/9458996/4730773
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

function appendBuffer(value: ArrayBuffer, xml: XMLBuilder): void {
  xml.ele('value').ele('base64').txt(arrayBufferToBase64(value));
}

import { create } from 'xmlbuilder2';
import { DateFormatter } from './date_formatter';
import { XMLBuilder } from 'xmlbuilder2/lib/interfaces';
import { XmlRpcTypes } from './xmlrpc-types';

/**
 * Creates the XML for an XML-RPC method call.
 *
 * @param method   - The method name.
 * @param params   - Params to pass in the call. If none are needed this parameter can be skipped.
 * @param encoding - The encoding which is added to the XML document. If no specific is required just skip it.
 */
export function serializeMethodCall(method: string, params?: Array<XmlRpcTypes>, encoding?: string): string {
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

interface MyStack {
  // TODO: Add types from else case
  value: XmlRpcTypes;
  xml: XMLBuilder;
  index?: number;
  keys?: Array<string>;
}

function serializeValue(value: XmlRpcTypes, xml: XMLBuilder): void {
  const stack: Array<MyStack> = [{ value, xml }];
  let current: MyStack;
  let valueNode: XMLBuilder;
  let next = null;

  while (stack.length > 0) {
    current = stack[stack.length - 1];

    if (current.index !== undefined) {
      // Iterating a compound
      next = getNextItemsFrame(current);
      if (next) {
        stack.push(next);
      } else {
        stack.pop();
      }
    } else {
      // we're about to add a new value (compound or simple)
      valueNode = current.xml.ele('value');
      switch (typeof current.value) {
        case 'boolean':
          appendBoolean(current.value, valueNode);
          stack.pop();
          break;
        case 'string':
          appendString(current.value, valueNode);
          stack.pop();
          break;
        case 'number':
          appendNumber(current.value, valueNode);
          stack.pop();
          break;
        case 'object':
          if (current.value === null) {
            valueNode.ele('nil');
            stack.pop();
          }
          if (current.value instanceof Date) {
            appendDatetime(current.value, valueNode);
            stack.pop();
          }
          if (Buffer.isBuffer(current.value)) {
            appendBuffer(current.value, valueNode);
            stack.pop();
          } else {
            // TODO: Fix mess below and split into array and struct
            if (Array.isArray(current.value)) {
              current.xml = valueNode.ele('array').ele('data');
            } else {
              current.xml = valueNode.ele('struct');
              current.keys = Object.keys(current.value);
            }
            current.index = 0;
            next = getNextItemsFrame(current);
            if (next) {
              stack.push(next);
            } else {
              stack.pop();
            }
          }
          break;
        default:
          stack.pop();
          break;
      }
    }
  }
}

function getNextItemsFrame(frame: any): any {
  let nextFrame = null;

  if (frame.keys) {
    if (frame.index < frame.keys.length) {
      const key = frame.keys[frame.index++];
      const member = frame.xml.ele('member').ele('name').text(key).up();
      nextFrame = {
        value: frame.value[key],
        xml: member
      };
    }
  } else if (frame.index < frame.value.length) {
    nextFrame = {
      value: frame.value[frame.index],
      xml: frame.xml
    };
    frame.index++;
  }

  return nextFrame;
}

function appendArray(): void {
  console.log('Needs to be implemented');
}

function appendStruct(): void {
  console.log('Needs to be implemented');
}

/**
 * This method appends to a node a boolean in XMLRPC style. This means that `true` is converted to `1` and `false` is
 * converted to `0`.
 *
 * @param value Either true or false.
 * @param xml The parent node the value should be appended to.
 */
function appendBoolean(value: boolean, xml: XMLBuilder): void {
  xml.ele('boolean').txt(value ? '1' : '0');
}

/**
 * This method appends to a node a string in XMLRPC style.
 *
 * @param value The string to append. Escaping if needed is done by XMLBuilder2
 * @param xml The parent node the value should be appended to.
 */
function appendString(value: string, xml: XMLBuilder): void {
  xml.ele('string').txt(value);
}

function appendNumber(value: number, xml: XMLBuilder): void {
  if (value % 1 === 0) {
    xml.ele('int').txt(value.toString());
  } else {
    xml.ele('double').txt(value.toString());
  }
}

function appendDatetime(value: Date, xml: XMLBuilder): void {
  const myDateFormatter = new DateFormatter();
  xml.ele('dateTime.iso8601').txt(myDateFormatter.encodeIso8601(value));
}

function appendBuffer(value: Buffer, xml: XMLBuilder): void {
  xml.ele('base64').txt(value.toString('base64'));
}

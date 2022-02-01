import {TestBed} from '@angular/core/testing';
import {serializeMethodCall} from './serializer';

describe('serializeMethodCall', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('function without parameters', () => {
    const expectedResult = `<?xml version="1.0"?><methodCall><methodName>function_name</methodName></methodCall>`;
    expect(serializeMethodCall('function_name')).toBe(expectedResult);
  });

  it('function without parameters but with encoding', () => {
    // eslint-disable-next-line max-len
    const expectedResult = `<?xml version="1.0" encoding="UTF-8"?><methodCall><methodName>function_name</methodName></methodCall>`;
    expect(serializeMethodCall('function_name', undefined, 'UTF-8')).toBe(expectedResult);
  });

  it('function with integer parameter', () => {
    // eslint-disable-next-line max-len
    const expectedResult = `<?xml version="1.0"?><methodCall><methodName>function_name</methodName><params><param><value><int>41</int></value></param></params></methodCall>`;
    expect(serializeMethodCall('function_name', [41])).toBe(expectedResult);
  });

  it('function with double parameter', () => {
    // eslint-disable-next-line max-len
    const expectedResult = `<?xml version="1.0"?><methodCall><methodName>function_name</methodName><params><param><value><double>41.2</double></value></param></params></methodCall>`;
    expect(serializeMethodCall('function_name', [41.2])).toBe(expectedResult);
  });

  it('function with boolean parameter', () => {
    // eslint-disable-next-line max-len
    const expectedResult = `<?xml version="1.0"?><methodCall><methodName>function_name</methodName><params><param><value><boolean>0</boolean></value></param></params></methodCall>`;
    expect(serializeMethodCall('function_name', [false])).toBe(expectedResult);
  });

  it('function with string parameter', () => {
    // eslint-disable-next-line max-len
    const expectedResult = `<?xml version="1.0"?><methodCall><methodName>function_name</methodName><params><param><value><string>text</string></value></param></params></methodCall>`;
    expect(serializeMethodCall('function_name', ['text'])).toBe(expectedResult);
  });

  it('function with date parameter', () => {
    // eslint-disable-next-line max-len
    const expectedResult = `<?xml version="1.0"?><methodCall><methodName>function_name</methodName><params><param><value><dateTime.iso8601>19700101T00:00:00Z</dateTime.iso8601></value></param></params></methodCall>`;
    expect(serializeMethodCall('function_name', [new Date('1970-01-01')])).toBe(expectedResult);
  });

  it('function with array parameter', () => {
    // eslint-disable-next-line max-len
    const expectedResult = `<?xml version="1.0"?><methodCall><methodName>function_name</methodName><params><param><value><array><data><value><string>elem1</string></value><value><string>elem2</string></value></data></array></value></param></params></methodCall>`;
    expect(serializeMethodCall('function_name', [
      {'data': ['elem1', 'elem2']}
    ])).toBe(expectedResult);
  });

  it('function with base64 parameter', () => {
    const myBuffer = new ArrayBuffer(8)
    const myexampledata = new Float64Array(myBuffer)
    myexampledata[0] = 42;
    myexampledata[0] = 42;
    // eslint-disable-next-line max-len
    const expectedResult = `<?xml version="1.0"?><methodCall><methodName>function_name</methodName><params><param><value><base64>Kg==</base64></value></param></params></methodCall>`;
    expect(serializeMethodCall('function_name', [myexampledata])).toBe(expectedResult);
  });

  it('function with struct parameter', () => {
    // eslint-disable-next-line max-len
    const expectedResult = `<?xml version="1.0"?><methodCall><methodName>function_name</methodName><params><param><value><struct><member><name>data1</name><value><int>0</int></value></member><member><name>data2</name><value><string></string></value></member></struct></value></param></params></methodCall>`;
    expect(serializeMethodCall('function_name',
      [{
        'members': [
          {name: "data1", value: 0},
          {name: 'data2', value: ""}
        ]
      }]
    )).toBe(expectedResult);
  });

  it('function with multiple parameters', () => {
    // eslint-disable-next-line max-len
    const expectedResult = `<?xml version="1.0"?><methodCall><methodName>function_name</methodName><params><param><value><int>41</int></value></param><param><value><int>41</int></value></param></params></methodCall>`;
    expect(serializeMethodCall('function_name', [41, 41])).toBe(expectedResult);
  });

  it('function with multiple parameters and encoding', () => {
    // eslint-disable-next-line max-len
    const expectedResult = `<?xml version="1.0" encoding="UTF-8"?><methodCall><methodName>function_name</methodName><params><param><value><int>41</int></value></param><param><value><int>41</int></value></param></params></methodCall>`;
    expect(serializeMethodCall('function_name', [41, 41], 'UTF-8')).toBe(expectedResult);
  });
});

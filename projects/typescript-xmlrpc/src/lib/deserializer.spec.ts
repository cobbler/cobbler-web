import { TestBed } from '@angular/core/testing';
import { deserialize } from './deserializer';
import { applicationError } from './constants';
import { MethodFault, MethodResponse } from './xmlrpc-types';

describe('Deserializer', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('method response with string', () => {
    // eslint-disable-next-line max-len
    const goodInput = `<?xml version="1.0"?><methodResponse><params><param><value><string>South Dakota</string></value></param></params></methodResponse>`;
    const result = deserialize(goodInput);
    const expected: MethodResponse = { value: 'South Dakota' };
    expect(result).toEqual(expected);
  });

  it('method response with int', () => {
    // eslint-disable-next-line max-len
    const goodInput = `<?xml version="1.0"?><methodResponse><params><param><value><i4>10</i4></value></param></params></methodResponse>`;
    const result = deserialize(goodInput);
    const expected: MethodResponse = { value: 10 };
    expect(result).toEqual(expected);
  });

  it('method response with true bool', () => {
    // eslint-disable-next-line max-len
    const goodInput = `<?xml version="1.0"?><methodResponse><params><param><value><boolean>1</boolean></value></param></params></methodResponse>`;
    const result = deserialize(goodInput);
    const expected: MethodResponse = { value: true };
    expect(result).toEqual(expected);
  });

  it('method response with false bool', () => {
    // eslint-disable-next-line max-len
    const goodInput = `<?xml version="1.0"?><methodResponse><params><param><value><boolean>0</boolean></value></param></params></methodResponse>`;
    const result = deserialize(goodInput);
    const expected: MethodResponse = { value: false };
    expect(result).toEqual(expected);
  });

  it('method response with invalid bool', () => {
    // eslint-disable-next-line max-len
    const goodInput = `<?xml version="1.0"?><methodResponse><params><param><value><boolean>text</boolean></value></param></params></methodResponse>`;
    const result = deserialize(goodInput);
    expect(result).toEqual(applicationError);
  });

  it('fault response', () => {
    // eslint-disable-next-line max-len
    const goodInput = `<?xml version="1.0"?><methodResponse><fault><value><struct><member><name>faultCode</name><value><int>4</int></value></member><member><name>faultString</name><value><string>Too many parameters.</string></value></member></struct></value></fault></methodResponse>`;
    const result = deserialize(goodInput);
    const expected: MethodFault = {
      faultCode: 4,
      faultString: 'Too many parameters.',
    };
    expect(result).toEqual(expected);
  });

  it('process garbage like server errors', () => {
    const badInput =
      'This is garbage. Do not fail but return meaningful content.';
    const result = deserialize(badInput);
    expect(result).toEqual(applicationError);
  });
});

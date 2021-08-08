import { TestBed } from '@angular/core/testing';
import { serializeMethodCall } from './serializer';

describe('serializeMethodCall', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('function without parameters', () => {
    const expectedResult = `<?xml version="1.0"?><methodCall><methodName>function_name</methodName></methodCall>`;
    expect(serializeMethodCall('function_name')).toBe(expectedResult);
  });

  it('function without parameters but with encoding', () => {
    const expectedResult = `<?xml version="1.0" encoding="UTF-8"?><methodCall><methodName>function_name</methodName></methodCall>`;
    expect(serializeMethodCall('function_name', undefined, 'UTF-8')).toBe(expectedResult);
  });

  it('function with parameter', () => {
    const expectedResult = `<?xml version="1.0"?><methodCall><methodName>function_name</methodName><params><param><value><int>41</int></value></param></params></methodCall>`;
    expect(serializeMethodCall('function_name', [41])).toBe(expectedResult);
  });

  it('function with multiple parameters', () => {
    const expectedResult = `<?xml version="1.0"?><methodCall><methodName>function_name</methodName><params><param><value><int>41</int></value></param><param><value><int>41</int></value></param></params></methodCall>`;
    expect(serializeMethodCall('function_name', [41, 41])).toBe(expectedResult);
  });

  it('function with multiple parameters and encoding', () => {
    const expectedResult = `<?xml version="1.0" encoding="UTF-8"?><methodCall><methodName>function_name</methodName><params><param><value><int>41</int></value></param><param><value><int>41</int></value></param></params></methodCall>`;
    expect(serializeMethodCall('function_name', [41, 41], 'UTF-8')).toBe(expectedResult);
  });
});

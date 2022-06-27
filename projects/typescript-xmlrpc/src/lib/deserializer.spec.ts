import {TestBed} from '@angular/core/testing';
import {deserialize} from './deserializer';
import {applicationError} from './constants';

describe('Deserializer', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('method response with string', () => {
    const goodInput = `<?xml version="1.0"?>
<methodResponse>
    <params>
        <param>
            <value><string>South Dakota</string></value>
            </param>
        </params>
    </methodResponse>`;
    const result = deserialize(goodInput);
    expect(result).toEqual({value: 'South Dakota'});
  });

  it('method response with int', () => {
    const goodInput = `<?xml version="1.0"?>
<methodResponse>
    <params>
        <param>
            <value><i4>10</i4></value>
            </param>
        </params>
    </methodResponse>`;
    const result = deserialize(goodInput);
    expect(result).toEqual({value: 10});
  });

  it('method response with true bool', () => {
    const goodInput = `<?xml version="1.0"?>
<methodResponse>
    <params>
        <param>
            <value><boolean>1</boolean></value>
            </param>
        </params>
    </methodResponse>`;
    const result = deserialize(goodInput);
    expect(result).toEqual({value: true});
  });

  it('method response with false bool', () => {
    const goodInput = `<?xml version="1.0"?>
<methodResponse>
    <params>
        <param>
            <value><boolean>0</boolean></value>
            </param>
        </params>
    </methodResponse>`;
    const result = deserialize(goodInput);
    expect(result).toEqual({value: false});
  });

  it('method response with invalid bool', () => {
    const goodInput = `<?xml version="1.0"?>
<methodResponse>
    <params>
        <param>
            <value><boolean>text</boolean></value>
            </param>
        </params>
    </methodResponse>`;
    const result = deserialize(goodInput);
    expect(result).toEqual(applicationError);
  });

  it('fault response', () => {
    const goodInput = `<?xml version="1.0"?>
<methodResponse>
    <fault>
        <value>
            <struct>
                <member>
                    <name>faultCode</name>
                    <value><int>4</int></value>
                    </member>
                <member>
                    <name>faultString</name>
                    <value><string>Too many parameters.</string></value>
                    </member>
                </struct>
            </value>
        </fault>
    </methodResponse>`;
    const result = deserialize(goodInput);
    expect(result).toEqual({faultCode: 4, faultString: 'Too many parameters.'});
  });

  it('process garbage like server errors', () => {
    const badInput = 'This is garbage. Do not fail but return meaningful content.';
    const result = deserialize(badInput);
    expect(result).toEqual(applicationError);
  });
});

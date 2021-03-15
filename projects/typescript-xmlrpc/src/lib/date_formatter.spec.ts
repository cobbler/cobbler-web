import {TestBed} from '@angular/core/testing';
import DateFormatter from './date_formatter';

describe('DateFormatter', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('DateFormatter should be created', () => {
    expect(new DateFormatter()).toBeTruthy();
  });

  it('method response', () => {
    // Arrange
    const goodInput = new Date(0);
    const epectedResult = '19700101T00:00:00Z';
    const formatter = new DateFormatter(true, false, false, false, false);

    // Act
    const result = formatter.encodeIso8601(goodInput);

    // Assert
    expect(result).toEqual(epectedResult);
  });
});

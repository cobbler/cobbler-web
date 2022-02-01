import {TestBed} from '@angular/core/testing';
import DateFormatter from './date_formatter';

describe('DateFormatter', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({});
    jasmine.clock().uninstall();
    jasmine.clock().install();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  })

  it('DateFormatter should be created', () => {
    expect(new DateFormatter()).toBeTruthy();
  });

  const parameters = [
    {colons: true, hyphens: true, local: true, ms: true, offset: true, expectedResult: "1970-01-01T01:00:00.000+01:00"},
    {colons: true, hyphens: true, local: true, ms: true, offset: false, expectedResult: "1970-01-01T01:00:00.000"},
    {colons: true, hyphens: true, local: true, ms: false, offset: true, expectedResult: "1970-01-01T01:00:00+01:00"},
    {colons: true, hyphens: true, local: true, ms: false, offset: false, expectedResult: "1970-01-01T01:00:00"},
    {colons: true, hyphens: true, local: false, ms: true, offset: true, expectedResult: "1970-01-01T00:00:00.000Z"},
    {colons: true, hyphens: true, local: false, ms: true, offset: false, expectedResult: "1970-01-01T00:00:00.000Z"},
    {colons: true, hyphens: true, local: false, ms: false, offset: true, expectedResult: "1970-01-01T00:00:00Z"},
    {colons: true, hyphens: true, local: false, ms: false, offset: false, expectedResult: "1970-01-01T00:00:00Z"},
    {colons: true, hyphens: false, local: true, ms: true, offset: true, expectedResult: "19700101T01:00:00.000+01:00"},
    {colons: true, hyphens: false, local: true, ms: true, offset: false, expectedResult: "19700101T01:00:00.000"},
    {colons: true, hyphens: false, local: true, ms: false, offset: true, expectedResult: "19700101T01:00:00+01:00"},
    {colons: true, hyphens: false, local: true, ms: false, offset: false, expectedResult: "19700101T01:00:00"},
    {colons: true, hyphens: false, local: false, ms: true, offset: true, expectedResult: "19700101T00:00:00.000Z"},
    {colons: true, hyphens: false, local: false, ms: true, offset: false, expectedResult: "19700101T00:00:00.000Z"},
    {colons: true, hyphens: false, local: false, ms: false, offset: true, expectedResult: "19700101T00:00:00Z"},
    {colons: true, hyphens: false, local: false, ms: false, offset: false, expectedResult: "19700101T00:00:00Z"},
    {colons: false, hyphens: true, local: true, ms: true, offset: true, expectedResult: "1970-01-01T010000.000+01:00"},
    {colons: false, hyphens: true, local: true, ms: true, offset: false, expectedResult: "1970-01-01T010000.000"},
    {colons: false, hyphens: true, local: true, ms: false, offset: true, expectedResult: "1970-01-01T010000+01:00"},
    {colons: false, hyphens: true, local: true, ms: false, offset: false, expectedResult: "1970-01-01T010000"},
    {colons: false, hyphens: true, local: false, ms: true, offset: true, expectedResult: "1970-01-01T000000.000Z"},
    {colons: false, hyphens: true, local: false, ms: true, offset: false, expectedResult: "1970-01-01T000000.000Z"},
    {colons: false, hyphens: true, local: false, ms: false, offset: true, expectedResult: "1970-01-01T000000Z"},
    {colons: false, hyphens: true, local: false, ms: false, offset: false, expectedResult: "1970-01-01T000000Z"},
    {colons: false, hyphens: false, local: true, ms: true, offset: true, expectedResult: "19700101T010000.000+01:00"},
    {colons: false, hyphens: false, local: true, ms: true, offset: false, expectedResult: "19700101T010000.000"},
    {colons: false, hyphens: false, local: true, ms: false, offset: true, expectedResult: "19700101T010000+01:00"},
    {colons: false, hyphens: false, local: true, ms: false, offset: false, expectedResult: "19700101T010000"},
    {colons: false, hyphens: false, local: false, ms: true, offset: true, expectedResult: "19700101T000000.000Z"},
    {colons: false, hyphens: false, local: false, ms: true, offset: false, expectedResult: "19700101T000000.000Z"},
    {colons: false, hyphens: false, local: false, ms: false, offset: true, expectedResult: "19700101T000000Z"},
    {colons: false, hyphens: false, local: false, ms: false, offset: false, expectedResult: "19700101T000000Z"},
  ]

  parameters.forEach((parameter) => {
    // eslint-disable-next-line max-len
    it(`encodeIso8601 with colons=${parameter.colons} hyphens=${parameter.hyphens} local=${parameter.local} ms=${parameter.ms} offset=${parameter.offset}`, () => {
      // Arrange
      const goodInput = new Date(Date.UTC(1970, 0, 1, 0, 0, 0));
      jasmine.clock().mockDate(goodInput)
      const formatter = new DateFormatter(
        parameter.colons,
        parameter.hyphens,
        parameter.local,
        parameter.ms,
        parameter.offset
      );

      // Act
      const result = formatter.encodeIso8601(goodInput);

      // Assert
      expect(result).toEqual(parameter.expectedResult);
    });
  })
});

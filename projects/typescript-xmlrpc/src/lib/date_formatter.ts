/**
 * The DateFormatter supports decoding from and encoding to ISO8601 formatted strings. Accepts formats with and without
 * hyphen/colon separators and correctly parses zoning info.
 */
export class DateFormatter {
  /**
   * Regular Expression that dissects ISO 8601 formatted strings into an array of parts.
   */
    // eslint-disable-next-line max-len
  static ISO8601 = new RegExp('([0-9]{4})([-]?([0-9]{2}))([-]?([0-9]{2}))(T([0-9]{2})(((:?([0-9]{2}))?((:?([0-9]{2}))?(\.([0-9]+))?))?)(Z|([+-]([0-9]{2}(:?([0-9]{2}))?)))?)?');

  colons = true;
  hyphens = false;
  local = true;
  ms = false;
  offset = false;

  /**
   * Helper function to pad the digits with 0s to meet date formatting
   * requirements.
   *
   * @param digit  - The number to pad.
   * @param length - Length of digit string, prefix with 0s if not already length.
   * @return String with the padded digit
   */
  static zeroPad(digit: number, length: number): string {
    let padded = '' + digit;
    while (padded.length < length) {
      padded = '0' + padded;
    }
    return padded;
  }

  /**
   * Helper function to get an array of zero-padded date parts, in UTC
   *
   * @param date - Date Object
   */
  static getUTCDateParts(date: Date): [number, string, string, string, string, string, string] {
    return [
      date.getUTCFullYear(),
      DateFormatter.zeroPad(date.getUTCMonth() + 1, 2),
      DateFormatter.zeroPad(date.getUTCDate(), 2),
      DateFormatter.zeroPad(date.getUTCHours(), 2),
      DateFormatter.zeroPad(date.getUTCMinutes(), 2),
      DateFormatter.zeroPad(date.getUTCSeconds(), 2),
      DateFormatter.zeroPad(date.getUTCMilliseconds(), 3)];
  }

  /**
   * Helper function to get the current timezone to default decoding to rather than UTC. (for backward compatibility)
   *
   * @return in the format /Z|[+-]\d{2}:\d{2}/
   */
  static formatCurrentOffset(d: any): string {
    const offset = (d || new Date()).getTimezoneOffset();
    return (offset === 0) ? 'Z' : [
      (offset < 0) ? '+' : '-',
      DateFormatter.zeroPad(Math.abs(Math.floor(offset / 60)), 2),
      ':',
      DateFormatter.zeroPad(Math.abs(offset % 60), 2)
    ].join('');
  }

  /**
   * Converts a date time stamp following the ISO8601 format to a JavaScript Date
   * object.
   *
   * @param time - String representation of timestamp.
   * @return Date object from timestamp.
   */
  static decodeIso8601(time: string): Date {
    const dateParts = time.toString().match(DateFormatter.ISO8601);
    if (!dateParts) {
      throw new Error('Expected a ISO8601 datetime but got \'' + time + '\'');
    }

    let date = [
      [dateParts[1], dateParts[3] || '01', dateParts[5] || '01'].join('-'),
      'T',
      [ dateParts[7] || '00', dateParts[11] || '00', dateParts[14] || '00' ].join(':'),
      '.',
      dateParts[16] || '000'
    ].join('');

    date += (dateParts[17] !== undefined)
      ? dateParts[17] + ((dateParts[19] && dateParts[20] === undefined) ? '00' : '') :
      DateFormatter.formatCurrentOffset(new Date(date));

    return new Date(date);
  }

  /**
   * Helper function to get an array of zero-padded date parts, in the local time zone
   *
   * @param date - Date Object
   */
  static getLocalDateParts(date: Date): [number, string, string, string, string, string, string] {
    return [
      date.getFullYear(),
      DateFormatter.zeroPad(date.getMonth() + 1, 2),
      DateFormatter.zeroPad(date.getDate(), 2),
      DateFormatter.zeroPad(date.getHours(), 2),
      DateFormatter.zeroPad(date.getMinutes(), 2),
      DateFormatter.zeroPad(date.getSeconds(), 2),
      DateFormatter.zeroPad(date.getMilliseconds(), 3)];
  }

  /**
   * Constructor for creating a DateFormatter.
   *
   * @param colons Enable/disable formatting the time portion with a colon as separator
   * @param hyphens Enable/disable formatting the date portion with a hyphen as separator
   * @param local Encode as local time instead of UTC
   * @param ms Enable/Disable output of milliseconds
   * @param offset Enable/Disable output of UTC offset
   */
  constructor(colons: boolean = true, hyphens: boolean = false, local: boolean = true, ms: boolean = false,
              offset: boolean = false) {
    this.colons = colons;
    this.hyphens = hyphens;
    this.local = local;
    this.ms = ms;
    this.offset = offset;
  }

  /**
   * Converts a JavaScript Date object to an ISO8601 timestamp.
   *
   * @param date - Date object.
   * @return String representation of timestamp.
   */
  encodeIso8601(date: Date): string {
    const parts = this.local ? DateFormatter.getLocalDateParts(date) : DateFormatter.getUTCDateParts(date);

    return [
      [parts[0], parts[1], parts[2]].join(this.hyphens ? '-' : ''),
      'T',
      [parts[3], parts[4], parts[5]].join(this.colons ? ':' : ''),
      (this.ms) ? '.' + parts[6] : '',
      (this.local) ? ((this.offset) ? DateFormatter.formatCurrentOffset(date) : '') : 'Z'
    ].join('');
  }
}

export default DateFormatter;

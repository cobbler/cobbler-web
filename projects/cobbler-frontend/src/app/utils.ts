export default class Utils {
  static toHTML(input: string): any {
    return new DOMParser().parseFromString(input, 'text/html').documentElement
      .textContent;
  }
}

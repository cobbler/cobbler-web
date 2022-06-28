import {InjectionToken} from '@angular/core';

export const COBBLER_URL = new InjectionToken<URL>('COBBLER_URL');

export const cobblerUrlFactory = () => {
  const value = localStorage.getItem("COBBLER_URL")
  if (value) {
    return new URL(value);
  }
  return new URL("http://localhost/cobbler_api")
}

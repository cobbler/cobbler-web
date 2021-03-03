import { Injectable } from '@angular/core';
import { environment, LogLevel } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  private level: LogLevel = environment.logLevel;

  constructor() { }

  private shouldLog(level: LogLevel): boolean {
    let ret: boolean = false;
    if ((level >= this.level && level !== LogLevel.Off) || this.level === LogLevel.All) {
        ret = true;
    }
    return ret;
  }

  log(msg: any, level: LogLevel) {
    if (this.shouldLog(level)){
      let mydate = new Date().toUTCString();
      console.log(mydate + " - Type: " + LogLevel[level] + " - " + JSON.stringify(msg));
    }
  }

  debug(msg: any) {
    this.log(msg, LogLevel.Debug);
  }

  info(msg: any) {
    this.log(msg, LogLevel.Info);
  }

  warn(msg: any) {
    this.log(msg, LogLevel.Warn);
  }

  error(msg: any) {
    this.log(msg, LogLevel.Error);
  }

  fatal(msg: any) {
    this.log(msg, LogLevel.Fatal);
  }

}

import { info } from 'console';
import { IEnvironment, LogLevel } from './ienvironment';

const environment: IEnvironment = {
  production: true,
  logLevel: LogLevel.Info
};

export { environment, LogLevel }
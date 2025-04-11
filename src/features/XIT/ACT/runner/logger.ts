export type LogTag = null | 'INFO' | 'ACTION' | 'SUCCESS' | 'ERROR' | 'WARNING' | 'CANCEL';

export class Logger {
  constructor(public readonly logMessage: (tag: LogTag, msg: string) => void) {}

  label(msg: string) {
    this.logMessage(null, msg);
  }

  info(msg: string) {
    this.logMessage('INFO', msg);
  }

  action(msg: string) {
    this.logMessage('ACTION', msg);
  }

  success(msg: string) {
    this.logMessage('SUCCESS', msg);
  }

  error(msg: string) {
    this.logMessage('ERROR', msg);
  }

  warning(msg: string) {
    this.logMessage('WARNING', msg);
  }

  cancel(msg: string) {
    this.logMessage('CANCEL', msg);
  }
}

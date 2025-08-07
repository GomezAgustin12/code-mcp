export interface LogService {
  info(message: string, ...args: any[]): void;
  warn(message: string, ...args: any[]): void;
  error(message: string, ...args: any[]): void;
  debug(message: string, ...args: any[]): void;
}

export class LogService implements LogService {
  private test: boolean;

  constructor(test: boolean = false) {
    this.test = test;
  }

  /**
   * Log info message only if test is true
   */
  info(message: string, ...args: any[]): void {
    if (this.test) {
      console.info(`\x1b[34m[INFO] ${message}\x1b[0m`, ...args);
    }
  }

  /**
   * Log warning message only if test is true
   */
  warn(message: string, ...args: any[]): void {
    if (this.test) {
      console.warn(`\x1b[33m[WARN] ${message}\x1b[0m`, ...args);
    }
  }

  /**
   * Log error message only if test is true
   */
  error(message: string, ...args: any[]): void {
    if (this.test) {
      console.error(`\x1b[31m[ERROR] ${message}\x1b[0m`, ...args);
    }
  }

  /**
   * Log debug message only if test is true
   */
  debug(message: string, ...args: any[]): void {
    if (this.test) {
      console.debug(`\x1b[90m[DEBUG] ${message}\x1b[0m`, ...args);
    }
  }
}

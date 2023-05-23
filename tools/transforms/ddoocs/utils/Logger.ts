import chalk from 'chalk';

export enum LogLevels {
  DEBUG = 1,
  INFO = 2,
  WARN = 3,
  ERROR = 4
}

export class Logger {
  constructor(private logLevel: LogLevels) {}

  info(...message: unknown[]): void {
    if (this.logLevel > LogLevels.INFO) return;
    console.log(chalk.green('info') + `:    ${message}`);
  }

  warn(...message: unknown[]): void {
    if (this.logLevel > LogLevels.WARN) return;
    console.log(chalk.yellow('warn') + `:    ${message}`);
  }

  error(...message: unknown[]): void {
    if (this.logLevel > LogLevels.ERROR) return;
    console.error(chalk.red('error') + `:   ${message}`);
  }

  debug(...message: unknown[]): void {
    if (this.logLevel > LogLevels.DEBUG) return;
    console.log(chalk.blue('debug') + `:   ${message}`);
  }
}

import { Dgeni, Package } from 'dgeni';
import * as angularMain from './dgeni/angular.io-package';
import * as angularContent from './dgeni/angular-content-package';
import * as yargs from 'yargs';
import * as process from 'process';
import { DdoocsTransformRunner, LogLevels } from './ddoocs';
import { API_SOURCE_PATH, repositories } from './config';

type DgeniLogLevels = 'error' | 'warn' | 'info' | 'http' | 'verbose' | 'debug' | 'silly';

const args = yargs
  .options('l', {
    alias: 'log',
    describe: 'Log level for messages',
    type: 'string',
    choices: ['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly']
  })
  .options('content-only', {
    describe: 'Generates only content (without api reference)',
    type: 'boolean',
    default: false
  })
  .options('dgeni-only', {
    describe: 'Run Dgeni-only transformations for source code',
    type: 'boolean',
    default: false
  });

export class Executor {
  private readonly parsedArgs: ReturnType<typeof args['parseSync']>;

  private readonly dgeniCliPackage: Package | undefined;
  private readonly logLevel: LogLevels;

  constructor(argv: typeof args) {
    this.parsedArgs = argv.parseSync();
    this.logLevel = this.parseDgeniLogLevels(this.parsedArgs.l as DgeniLogLevels);
    this.dgeniCliPackage = this.parsedArgs.l
      ? this.createDgeniCliPackage(this.parsedArgs.l as DgeniLogLevels)
      : undefined;
  }

  run(): void {
    if (this.parsedArgs.contentOnly) {
      return this.generateContentOnly();
    } else {
      return this.generateFullDocs();
    }
  }

  private generateContentOnly(): void {
    const packages = [angularContent];
    if (this.dgeniCliPackage) {
      packages.push(this.dgeniCliPackage);
    }

    new Dgeni(packages)
      .generate()
      .then(() => console.log('Finished generating content'))
      .catch((err) => {
        console.log('Catched error: ', err);
        process.exit(1);
      });
  }

  private generateFullDocs(): void {
    const packages = [angularMain];
    if (this.dgeniCliPackage) {
      packages.push(this.dgeniCliPackage);
    }

    if (!this.parsedArgs.dgeniOnly) {
      new DdoocsTransformRunner(this.logLevel, API_SOURCE_PATH, repositories).run();
    }

    new Dgeni(packages)
      .generate()
      .then(() => console.log('Finished generating docs'))
      .catch((err) => {
        console.log('Catched error: ', err);
        process.exit(1);
      });
  }

  private createDgeniCliPackage(logLevel: DgeniLogLevels): Package {
    return new Dgeni()
      .package('cli-package')
      .config(function (log) {
        log.level = logLevel;
      });
  }

  private parseDgeniLogLevels(dgeniLogLevel: DgeniLogLevels): LogLevels {
    switch (dgeniLogLevel) {
      case 'silly':
      case 'verbose':
      case 'debug':
        return LogLevels.DEBUG;
      case 'error':
        return LogLevels.ERROR;
      default:
        return LogLevels.INFO;
    }
  }
}

new Executor(args).run();

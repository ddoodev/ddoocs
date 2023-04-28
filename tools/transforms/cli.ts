import { Dgeni, Package } from 'dgeni';
import * as angularMain from './dgeni/angular.io-package';
import * as angularContent from './dgeni/angular-content-package';
import * as yargs from 'yargs';
import * as process from 'process';
import { ddoocsTransformRunner } from './ddoocs';
import { API_SOURCE_PATH, repositories } from './config';

type logLevels = 'error' | 'warn' | 'info' | 'http' | 'verbose' | 'debug' | 'silly';

const args = yargs
  .options('l', {
    alias: 'log',
    describe: 'Log messages for Dgeni',
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

function createDgeniCliPackage(logLevel: logLevels) {
  return new Dgeni()
    .package('cli-package')
    .config(function (log) {
      log.level = logLevel;
    });
}

function generateContentOnly(cliPackage?: Package) {
  const packages = [angularContent];
  if (cliPackage) {
    packages.push(cliPackage);
  }

  new Dgeni(packages)
    .generate()
    .then(() => console.log('Finished generating content'))
    .catch((err) => {
      console.log('Catched error: ', err);
      process.exit(1);
    });
}

function generateDocs(cliPackage: Package | undefined, dgeniOnly: boolean) {
  if (!dgeniOnly) {
    ddoocsTransformRunner(API_SOURCE_PATH, repositories);
  }

  const packages = [angularMain];
  if (cliPackage) {
    packages.push(cliPackage);
  }

  new Dgeni(packages)
    .generate()
    .then(() => console.log('Finished generating docs'))
    .catch((err) => {
      console.log('Catched error: ', err);
      process.exit(1);
    });
}

function executor() {
  const parsedArgs = args.parseSync();
  const cliPackage = parsedArgs.l ? createDgeniCliPackage(parsedArgs.l as logLevels) : undefined;

  if (parsedArgs.contentOnly) {
    return generateContentOnly(cliPackage);
  } else {
    return generateDocs(cliPackage, parsedArgs.dgeniOnly);
  }
}

executor();

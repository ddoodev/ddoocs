import { Repository } from './types';
import { join, resolve } from 'path';
import { readdirSync } from 'fs';

export function convertRepositoriesToDgeniModules(repositories: Repository[]): string[] {
  return repositories.map(repo => repo.modules.map(m => join(repo.name, getSourceFolderName(repo), m))).flat();
}

export function getSourceFolderName(repository: Repository): string {
  return repository.sourceFolder || 'src';
}

export function requireFolder(dirname, folderPath) {
  const absolutePath = resolve(dirname, folderPath);
  return readdirSync(absolutePath)
    .filter(p => !/[._]spec\.js$/.test(p))  // ignore spec files
    .map(p => require(resolve(absolutePath, p)));
}


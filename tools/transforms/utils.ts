import { Repository } from './types';
import { join, resolve } from 'path';
import { readdirSync } from 'fs';

export function convertRepositoriesToDgeniModules(repositories: Repository[]): string[] {
  return repositories
    .map(repo => {
      const mappedRepository = repo.modules.map(m => getPathFromRepositoryRootToFile(repo, m));
      if (repo.pseudoRootIndex) {
        mappedRepository.push(getPathFromRepositoryRootToFile(repo, 'index.ts'));
      }
      return mappedRepository.sort((a, b) => a.localeCompare(b));
    })
    .flat();
}

export function getPathFromRepositoryRootToFile(repository: Repository, filename: string) {
  return join(repository.name, getSourceFolderName(repository), filename);
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

import { FsMethods, Repository } from './types';
import { join, resolve } from 'path';
import * as ts from 'typescript';
import { Volume } from 'memfs/lib/volume';
import * as fs from 'fs';

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

export function requireFolder(dirname: string, folderPath: string) {
  const absolutePath = resolve(dirname, folderPath);

  return fs.readdirSync(absolutePath)
    .filter(p => !/[._]spec\.js$/.test(p))  // ignore spec files
    .map(p => require(resolve(absolutePath, p)));
}

export function memFsVolumeFactory(projectRoot: string, inMemoryDirs: string[]): Volume {
  const inMemoryDirPaths = inMemoryDirs.map((v) => join(projectRoot, v));
  const exclude = fs
    .readdirSync(projectRoot)
    .map((v) => join(projectRoot, v))
    .filter((v) => !inMemoryDirPaths.includes(v));

  const files = ts.sys.readDirectory(projectRoot, undefined, exclude);
  const pathContentMap: Record<string, string> = {};

  for (const file of files) {
    pathContentMap[file] = 'θ';
  }

  return Volume.fromJSON(pathContentMap);
}

export function getInMemoryReadSyncFs(
  projectRoot: string,
  inMemoryDirs: string[],
  volume: Volume
): Partial<FsMethods>
{
  const inMemoryDirPath = inMemoryDirs.map((v) => join(projectRoot, v));
  const isInMemoryPath = (path: fs.PathLike) =>
    inMemoryDirPath.some((v) => join(path.toString()).includes(v));

  const originalMethods = {
    readFileSync: fs['readFileSync'],
    readdirSync: fs['readdirSync'],
    existsSync: fs['existsSync'],
  };

  return {
    readFileSync: (path: fs.PathLike, opts?: any) => {
      if (isInMemoryPath(path)) {
        const res = volume.readFileSync(path, opts);

        if (res !== 'θ') {
          return res;
        }

        const file = originalMethods.readFileSync(path, opts);
        volume.writeFileSync(path, file);
        return file;
      }

      return originalMethods.readFileSync(path, opts);
    },
    readdirSync: (path: fs.PathLike, opts?: any) => {
      if (isInMemoryPath(path)) {
        return volume.readdirSync(path, opts);
      }

      return originalMethods.readdirSync(path, opts);
    },
    existsSync: (path: fs.PathLike) => {
      if (isInMemoryPath(path)) {
        return volume.existsSync(path);
      }

      return originalMethods.existsSync(path);
    }
  };
}

export function monkeyPatchFs(methods: Partial<FsMethods>) {
  Object.keys(methods).forEach((key) => {
    fs[key] = methods[key];
  });
}

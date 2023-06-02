import * as fs from 'fs';
import { join, sep } from 'path';
import { Folder } from '../interfaces';
import { FileSystem, Logger } from '../utils';

const indexFileName = 'index.ts';

enum PathType {
  Directory,
  File,
}

export class DirectoryReader {
  constructor(private readonly logger: Logger, private readonly fileSystem: FileSystem) {}

  private isDirectoryOrFile(path: string): PathType {
    const lstat = fs.lstatSync(path);

    if (lstat.isFile()) {
      return PathType.File;
    } else if (lstat.isDirectory()) {
      return PathType.Directory;
    } else {
      throw new Error(`${path} is not directory or file`);
    }
  }

  private search(path: string, dirContent: string[], search: PathType): string[] {
    return dirContent.filter(
      (element) => this.isDirectoryOrFile(join(path, element)) === search
    );
  }

  private readRecursive(path: string): Folder {
    const directory = this.fileSystem.readDirectory(path);
    const index = directory.find((el) => el === indexFileName);
    if (!index) {
      this.logger.warn(`index not found ${path}`);
    }

    const folders = this.search(path, directory, PathType.Directory)
      .map((folder) => this.readRecursive(join(path, folder)));
    const files = this.search(path, directory, PathType.File).filter(
      (fileName) => fileName !== indexFileName
    );
    const splittedPath = path.split(sep);
    return {
      name: splittedPath[splittedPath.length - 1],
      path: path,
      indexPath: index ? join(path, indexFileName) : undefined,
      files,
      folders,
    };
  }

  read(path: string): Folder {
    return this.readRecursive(path);
  }
}

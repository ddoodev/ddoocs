import { DirectoryReader } from './readers';
import { TransformRunner } from './TransformRunner';
import {
  contains,
  FileSystem,
  IFileSystem,
  InMemoryFileSystem,
  Logger,
  LogLevels,
  mergeImportsDeclarationsPaths
} from './utils';
import { Repository } from '../types';
import { join, sep } from 'path';
import { getSourceFolderName } from '../utils';
import * as ts from 'typescript';
import { EnumTransformer, ImportPathsTransformer, IndexFileTransformer, RootIndexFileTransformer } from './transformers';
import { Folder } from './interfaces';
import { Volume } from 'memfs/lib/volume';

export class DdoocsTransformRunner {
  private readonly directoryReader: DirectoryReader;
  private readonly transformRunner: TransformRunner;
  private readonly logger: Logger;
  private readonly fileSystem: IFileSystem;
  private readonly printer = ts.createPrinter({ removeComments: false });

  private readonly indexFileTransformer: IndexFileTransformer = new IndexFileTransformer(
    '@ddoocs',
    'ignore',
    'force-export'
  );
  private readonly rootIndexFileTransformer: RootIndexFileTransformer = new RootIndexFileTransformer();

  private readonly sourceFolderAlias = '@src';
  private readonly repositoryName = '@discordoo';

  constructor(
    logLevel: LogLevels,
    private repositoryPath: string,
    private repositories: Repository[],
    volume?: Volume
  ) {
    this.logger = new Logger(logLevel);

    if (volume) {
      this.fileSystem = new InMemoryFileSystem(this.logger, volume);
    } else {
      this.fileSystem = new FileSystem(this.logger);
    }

    this.directoryReader = new DirectoryReader(this.logger, this.fileSystem);
    this.transformRunner = new TransformRunner(this.logger, this.fileSystem)
      .addIndexTransformer((sourceFile) => this.indexTransformer(sourceFile))
      .addIndexTransformer(
        (sourceFile, filePath, folder) =>
          this.rootIndexTransformer(sourceFile, filePath, folder)
      )
      .addFileTransformer((sourceFile) => this.enumTransformer(sourceFile))
      .addFileTransformer(
        (sourceFile, filePath) =>
          this.pathTransformer(sourceFile, filePath)
      );
  }

  run(): void {
    this.logger.info('running ddoocs transforms');

    this.repositories.forEach((repo) => {
      const srcPath = join(this.repositoryPath, repo.name, getSourceFolderName(repo));
      const folder = this.directoryReader.read(srcPath);

      this.transformRunner.run(folder);
    });
  }

  private enumTransformer(sourceFile: ts.SourceFile): string | undefined {
    const isContainsEnumDeclaration = contains(ts.SyntaxKind.EnumDeclaration, sourceFile);
    if (!isContainsEnumDeclaration) return;

    const enumTransformer = new EnumTransformer(sourceFile);
    const res = enumTransformer.transform();
    return this.printer.printFile(res.transformed[0] as ts.SourceFile);
  }

  private indexTransformer(sourceFile: ts.SourceFile): string {
    return this.indexFileTransformer.transform(sourceFile);
  }

  private rootIndexTransformer(sourceFile: ts.SourceFile, filePath: string, folder: Folder): string | undefined {
    const repository = this.getRepository(filePath);

    if (!repository) {
      throw new Error(`Unexpected error while transform ${filePath}`);
    }

    if (folder.name !== getSourceFolderName(repository) || !repository.pseudoRootIndex) return;

    this.fileSystem.writeFile(
      filePath.replace('index.ts', '_index.ts'),
      this.printer.printFile(sourceFile)
    );

    const res = this.rootIndexFileTransformer.transform(repository);
    return this.printer.printFile(res as ts.SourceFile);
  }

  private pathTransformer(sourceFile: ts.SourceFile, filePath: string) {
    const repository = this.getRepository(filePath);
    if (!repository) {
      throw new Error(`Unexpected error while transform ${filePath}`);
    }

    const sourceFolderName = getSourceFolderName(repository);
    const repositorySourceFolder = join(this.repositoryPath, repository.name, sourceFolderName);

    const importPathsTransformer = new ImportPathsTransformer(
      sourceFile,
      this.sourceFolderAlias,
      sourceFolderName,
      this.repositoryName,
      {
        sourceFolderPath: repositorySourceFolder,
        repositoriesRootPath: this.repositoryPath,
        filePath: filePath
      }
    );
    const res = importPathsTransformer.transform().transformed[0] as ts.SourceFile;
    const transformedSourceFile = ts.createSourceFile(
      res.fileName,
      this.printer.printFile(res),
      ts.ScriptTarget.Latest
    );

    return mergeImportsDeclarationsPaths(sourceFile, transformedSourceFile);
  }

  private getRepository(filePath: string): Repository | undefined {
    const normalizedPath = filePath.replace(this.repositoryPath, '').replace(sep, '');

    const repositoryName = normalizedPath.split(sep)[0];
    return this.repositories.find((repo) => repo.name === repositoryName);
  }
}

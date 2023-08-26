import * as ts from 'typescript';
import { Folder } from './interfaces';
import { join } from 'path';
import { FileSystem, Logger } from './utils';

/*
 * [string, string, boolean] -
 * transformation result,
 * filepath for write file,
 * create source file based on this result
 * */
type TransformerCallback =
  (sourceFile: ts.SourceFile, filePath: string, folder: Folder) => string | [ string, string, boolean ] | undefined;

export class TransformRunner {
  private indexTransformers: TransformerCallback[] = [];
  private fileTransformers: TransformerCallback[] = [];

  constructor(
    private readonly logger: Logger,
    private readonly printer: ts.Printer,
    private readonly fileSystem: FileSystem,
    private readonly languageVersion?: ts.ScriptTarget,
  ) {}

  addIndexTransformer(callback: TransformerCallback) {
    this.indexTransformers.push(callback);
    return this;
  }

  addFileTransformer(callback: TransformerCallback) {
    this.fileTransformers.push(callback);
    return this;
  }

  run(folder: Folder): void {
    if (folder.indexPath) {
      const indexPath = folder.indexPath as string;
      const sourceText = this.fileSystem.readFile(indexPath);
      let sourceFile = this.createSourceFile('index.ts', sourceText);

      this.logger.debug(`running index transformer for ${indexPath}`);
      this.indexTransformers.forEach((transformer) => {
        const res = transformer(sourceFile, indexPath, folder);

        if (Array.isArray(res)) {
          this.fileSystem.writeFile(res[0], res[1]);
          if (res[2]) sourceFile = this.createSourceFile('index.ts', res[0]);
        } else if (typeof res === 'string') {
          this.fileSystem.writeFile(indexPath, res);
          sourceFile = this.createSourceFile('index.ts', res);
        } else {
          return;
        }
      });
    }

    if (folder.files.length) {
      folder.files.forEach((file) => {
        const path = join(folder.path, file);
        const sourceText = this.fileSystem.readFile(path);
        let sourceFile = this.createSourceFile(file, sourceText);

        this.logger.debug(`running file transformers for ${path}`);

        this.fileTransformers.forEach((transformer) => {
          const res = transformer(sourceFile, path, folder);

          if (Array.isArray(res)) {
            this.fileSystem.writeFile(res[0], res[1]);
            if (res[2]) sourceFile = this.createSourceFile(file, res[0]);
          } else if (typeof res === 'string') {
            this.fileSystem.writeFile(path, res);
            sourceFile = this.createSourceFile(file, res);
          } else {
            return;
          }
        });
      });
    }

    if (folder.folders.length) {
      folder.folders.forEach((v) => this.run(v));
    }
  }

  private createSourceFile(fileName: string, sourceText: string) {
    return ts.createSourceFile(fileName, sourceText, this.languageVersion ?? ts.ScriptTarget.Latest);
    // return program.getSourceFile(fileName) as ts.SourceFile;
  }
}

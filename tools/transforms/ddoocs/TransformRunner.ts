import * as ts from 'typescript';
import { Folder } from './interfaces';
import * as fs from 'fs';
import { join } from 'path';
import { Logger } from './utils';

/* [string, string, boolean] -
 * transformation result,
 * filepath for write file,
 * create source file based on this result */
type TransformerCallback =
  (sourceFile: ts.SourceFile, filePath: string, folder: Folder) => string | [ string, string, boolean ] | undefined;

export class TransformRunner {
  private indexTransformers: TransformerCallback[] = [];
  private fileTransformers: TransformerCallback[] = [];

  constructor(
    private readonly logger: Logger,
    private readonly printer: ts.Printer,
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
      const sourceText = fs.readFileSync(indexPath, { encoding: 'utf-8' });
      let sourceFile = this.createSourceFile('index.ts', sourceText);

      this.logger.debug(`running index transformer for ${indexPath}`);
      this.indexTransformers.forEach((transformer) => {
        const res = transformer(sourceFile, indexPath, folder);

        if (Array.isArray(res)) {
          fs.writeFileSync(res[0], res[1]);
          if (res[2]) sourceFile = this.createSourceFile('index.ts', res[0]);
        } else if (typeof res === 'string') {
          sourceFile = this.createSourceFile('index.ts', res);
        } else {
          return;
        }
      });

      fs.writeFileSync(indexPath, this.printer.printFile(sourceFile));
      this.logger.debug(`written file: ${indexPath}`);
    }

    if (folder.files.length) {
      folder.files.forEach((file) => {
        const path = join(folder.path, file);
        const sourceText = fs.readFileSync(path, { encoding: 'utf-8' });
        let sourceFile = this.createSourceFile(file, sourceText);

        this.logger.debug(`running file transformers for ${path}`);

        this.fileTransformers.forEach((transformer) => {
          const res = transformer(sourceFile, path, folder);

          if (Array.isArray(res)) {
            fs.writeFileSync(res[0], res[1]);
            sourceFile = this.createSourceFile(file, res[0]);
          } else if (typeof res === 'string') {
            sourceFile = this.createSourceFile(file, res);
          } else {
            return;
          }
        });

        fs.writeFileSync(path, this.printer.printFile(sourceFile));
        this.logger.debug(`written file: ${path}`);
      });
    }

    if (folder.folders.length) {
      folder.folders.forEach((v) => this.run(v));
    }
  }

  private createSourceFile(fileName: string, sourceText: string) {
    return ts.createSourceFile(fileName, sourceText, this.languageVersion ?? ts.ScriptTarget.Latest);
    //return program.getSourceFile(fileName) as ts.SourceFile;
  }
}

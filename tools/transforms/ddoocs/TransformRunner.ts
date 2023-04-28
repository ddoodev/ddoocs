import * as ts from 'typescript';
import { Folder } from './interfaces/Folder';
import * as fs from 'fs';
import { join } from 'path';

type TransformerCallback = (sourceFile: ts.SourceFile, filePath: string) => void;

export class TransformRunner {
  private fileTransformer: TransformerCallback;
  private indexTransformer: TransformerCallback;

  constructor(
    private languageVersion?: ts.ScriptTarget
  ) {}

  setIndexTransformation(callback: TransformerCallback) {
    this.indexTransformer = callback;
    return this;
  }

  setTransformation(callback: TransformerCallback) {
    this.fileTransformer = callback;
    return this;
  }

  run(folder: Folder): void {
    if (folder.indexPath) {
      const sourceText = fs.readFileSync(folder.indexPath, { encoding: 'utf-8' });
      const sourceFile = this.createSourceFile('index.ts', sourceText);

      console.log(`info: running index transformer for ${folder.indexPath}`);
      this.indexTransformer(sourceFile, folder.indexPath);
    }

    if (folder.files.length) {
      folder.files.forEach((file) => {
        const path = join(folder.path, file);
        const sourceText = fs.readFileSync(path, { encoding: 'utf-8' });
        const sourceFile = this.createSourceFile(file, sourceText);

        console.log(`info: running file transformer for ${path}`);
        this.fileTransformer(sourceFile, path);
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

import * as ts from 'typescript';
import { join, relative, sep, basename } from 'path';

export interface AbsolutePaths {
  /** Absolute path to folder with repositories.
   *
   * ex. /home/username/docs_app/repos/repository_name/ */
  repositoriesRootPath: string;
  /** Absolute path to repository source folder
   * ex. /home/username/docs_app/repos/repository_name/src
   */
  sourceFolderPath: string;
  /** Absolute path to file.
   *
   * ex. /home/username/docs_app/repos/repository_name/src/MyFile.ts */
  filePath: string;
}

export class ImportPathsTransformer {
  /**
   *
   * @param sourceFile Typescript source file.
   * @param sourceFolderAlias Alias used for short paths. ex. @src
   * @param sourceFolderName Source folder name
   * @param packageRepositoryName Package repository name.
   *
   * ex. in @discordoo/providers package repository name will be @discordoo
   *
   * @param absolutePaths Absolute paths map
   */
  constructor(
    private sourceFile: ts.SourceFile,
    private sourceFolderAlias: string,
    private sourceFolderName: string,
    private packageRepositoryName: string,
    private absolutePaths: AbsolutePaths
  ) {}

  transform() {
    try {
      return ts.transform(this.sourceFile, [this.transformer.bind(this)]);
    }
    catch (e) {
      throw new Error(
        `error while processing ImportPathsTransformer ${this.sourceFile.fileName}: ${e}`
      );
    }
  }

  private transformer(context: ts.TransformationContext): ts.Transformer<ts.SourceFile> {
    const { factory } = context;

    const visitor: ts.Visitor = (node: ts.Node): ts.Node => {
      if (ts.isImportDeclaration(node)) {
        let updatedStringLiteral: ts.StringLiteral | undefined = undefined;

        if (ts.isStringLiteral(node.moduleSpecifier)) {
          const text = node.moduleSpecifier.getText(this.sourceFile);
          const path = text.replace(/'|"/g, '');

          if (path.startsWith(this.sourceFolderAlias)) {
            const relativeSourcePath = relative(
              this.absolutePaths.filePath,
              this.absolutePaths.sourceFolderPath
            );

            const replacedPath = path.replace(
              this.sourceFolderAlias,
              join(relativeSourcePath, this.sourceFolderName)
            ).split(sep).join('/');

            updatedStringLiteral = factory.createStringLiteral(replacedPath);
          } else if (path.startsWith(this.packageRepositoryName)) {
            const repositoryName = path.split('/')[1];
            if (repositoryName) {
              const packageSourceFolderPath = join(
                this.absolutePaths.repositoriesRootPath,
                repositoryName,
                this.sourceFolderName
              );

              const folderPath = this.absolutePaths.filePath
                .replace(basename(this.absolutePaths.filePath), '');

              const relativePackageSourceFolderPath = relative(
                folderPath,
                join(packageSourceFolderPath, '_index'),
              );

              const replacedPath = relativePackageSourceFolderPath.split(sep).join('/');
              updatedStringLiteral = factory.createStringLiteral(replacedPath);
            }
          }
          else {
            updatedStringLiteral = node.moduleSpecifier;
          }
        }

        const updatedImportDeclaration = factory.updateImportDeclaration(
          node,
          node.modifiers,
          node.importClause,
          updatedStringLiteral ?? node.moduleSpecifier,
          node.assertClause
        );
        return ts.visitEachChild(updatedImportDeclaration, visitor, context);
      }

      return ts.visitEachChild(node, visitor, context);
    };

    return (sourceFile: ts.SourceFile) => ts.visitNode(sourceFile, visitor) as ts.SourceFile;
  }
}

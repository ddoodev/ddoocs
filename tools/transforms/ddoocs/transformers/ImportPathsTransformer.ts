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
  /** Typescript source file. */
  private static sourceFile: ts.SourceFile;
  /** Alias used for short paths.
   *
   * ex. @src */
  private static sourceFolderAlias: string;
  /** Source folder name */
  private static sourceFolderName: string;
  /** Package repository name.
   *
   * ex. in @discordoo/providers package repository name will be @discordoo */
  private static packageRepositoryName: string;
  /** Absolute paths map */
  private static absolutePaths: AbsolutePaths;

  constructor(
    sourceFile: ts.SourceFile,
    sourceFolderAlias: string,
    sourceFolderName: string,
    packageRepositoryName: string,
    absolutePaths: AbsolutePaths
  ) {
    ImportPathsTransformer.sourceFile = sourceFile;
    ImportPathsTransformer.sourceFolderAlias = sourceFolderAlias;
    ImportPathsTransformer.sourceFolderName = sourceFolderName;
    ImportPathsTransformer.packageRepositoryName = packageRepositoryName;
    ImportPathsTransformer.absolutePaths = absolutePaths;
  }

  transform() {
    try {
      return ts.transform(ImportPathsTransformer.sourceFile, [this.transformer]);
    }
    catch (e) {
      throw new Error(
        `error while processing ImportPathsTransformer ${ImportPathsTransformer.sourceFile.fileName}: ${e}`
      );
    }
  }

  private transformer(context: ts.TransformationContext): ts.Transformer<ts.SourceFile> {
    const { factory } = context;

    const visitor: ts.Visitor = (node: ts.Node): ts.Node => {
      if (ts.isImportDeclaration(node)) {
        let updatedStringLiteral: ts.StringLiteral | undefined = undefined;

        if (ts.isStringLiteral(node.moduleSpecifier)) {
          const text = node.moduleSpecifier.getText(ImportPathsTransformer.sourceFile);
          const path = text.replace(/'|"/g, '');

          if (path.startsWith(ImportPathsTransformer.sourceFolderAlias)) {
            const relativeSourcePath = relative(
              ImportPathsTransformer.absolutePaths.filePath,
              ImportPathsTransformer.absolutePaths.sourceFolderPath
            );

            const replacedPath = path.replace(
              ImportPathsTransformer.sourceFolderAlias,
              join(relativeSourcePath, ImportPathsTransformer.sourceFolderName)
            ).split(sep).join('/');

            updatedStringLiteral = factory.createStringLiteral(replacedPath);
          }
          else if (path.startsWith(ImportPathsTransformer.packageRepositoryName)) {
            const repositoryName = path.split('/')[1];
            if (repositoryName) {
              const packageSourceFolderPath = join(
                ImportPathsTransformer.absolutePaths.repositoriesRootPath,
                repositoryName,
                ImportPathsTransformer.sourceFolderName
              );

              const folderPath = ImportPathsTransformer.absolutePaths.filePath
                .replace(basename(ImportPathsTransformer.absolutePaths.filePath), '');

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

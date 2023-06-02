import * as ts from 'typescript';

/** dirty hack to keep original formatting after transformations */
export function mergeImportsDeclarationsPaths(oldFile: ts.SourceFile, newFile: ts.SourceFile) {
  const oldImportsDeclaration = oldFile.statements
    .filter((node) => node.kind === ts.SyntaxKind.ImportDeclaration) as ts.ImportDeclaration[];
  const newImportsDeclaration = newFile.statements
    .filter((node) => node.kind === ts.SyntaxKind.ImportDeclaration) as ts.ImportDeclaration[];

  let oldFileText = oldFile.getText(oldFile);

  for (let i = 0; i < oldImportsDeclaration.length; i++) {
    const oldImportPath = oldImportsDeclaration[i].moduleSpecifier.getText(oldFile)
      .replace(/'|"/g, '');
    const newImportPath = newImportsDeclaration[i].moduleSpecifier.getText(newFile)
      .replace(/'|"/g, '');

    oldFileText = oldFileText.replace(oldImportPath, newImportPath);
  }

  return oldFileText;
}

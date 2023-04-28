import * as ts from 'typescript';

export function contains(syntaxKind: ts.SyntaxKind, sourceFile: ts.SourceFile) {
  let contains = false;

  for (let i = 0; i < sourceFile.statements.length; i++) {
    const value = sourceFile.statements[i];
    if (value.kind === syntaxKind) {
      contains = true;
      break;
    }
  }

  return contains;
}

import { NamedExport, Repository } from '../../types';
import * as ts from 'typescript';

export class RootIndexFileTransformer {
  transform(repository: Repository) {
    const namedExports = repository.pseudoRootIndex?.namedExports?.map((v) => this.createNamedExportsDeclaration(v)) ?? undefined;
    const exportDeclarations = repository.pseudoRootIndex?.exports?.map((v) => this.createExportDeclaration(v)) ?? undefined;

    const statements: ts.Statement[] = [];
    if (namedExports) {
      statements.push(...namedExports);
    }
    if (exportDeclarations) {
      statements.push(...exportDeclarations);
    }

    return ts.factory.createSourceFile(
      statements,
      ts.factory.createToken(ts.SyntaxKind.EndOfFileToken),
      ts.NodeFlags.None
    );
  }

  private createExportDeclaration(exportPath: string) {
    const stringLiteral = ts.factory.createStringLiteral(exportPath, true);
    return ts.factory.createExportDeclaration(undefined, false, undefined, stringLiteral, undefined);
  }

  private createNamedExportsDeclaration(namedExport: NamedExport) {
    const exportSpecifiers = namedExport.exportedMemberNames.map((v) =>
      ts.factory.createExportSpecifier(false, undefined, v)
    );
    const namedExports = ts.factory.createNamedExports(exportSpecifiers);
    const stringLiteral = ts.factory.createStringLiteral(namedExport.path, true);

    return ts.factory.createExportDeclaration(undefined, false, namedExports, stringLiteral);
  }
}
